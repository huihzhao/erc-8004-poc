import { ponder } from "@/generated";
import { Agent, Service, Validation, Dispute, Reputation, Juror } from "../ponder.schema";

ponder.on("AgentIdentityRegistry:AgentRegistered", async ({ event, context }) => {
    await context.db.insert(Agent).values({
        id: event.args.tokenId,
        address: event.args.agentAddress,
        uri: event.args.uri,
    });
});

ponder.on("AgentServiceRegistry:ServiceRegistered", async ({ event, context }) => {
    await context.db.insert(Service).values({
        id: event.args.serviceId,
        agentId: event.args.agentId,
        metadataURI: event.args.metadataURI,
        active: true,
    });
});

ponder.on("AgentServiceRegistry:ServiceUpdated", async ({ event, context }) => {
    await context.db.update(Service, { id: event.args.serviceId }).set({
        metadataURI: event.args.metadataURI,
    });
});

ponder.on("AgentReputationRegistry:ReputationAdded", async ({ event, context }) => {
    const id = `${event.args.agentId}-${event.args.reviewer}-${event.block.timestamp}`;

    await context.db.insert(Reputation).values({
        id,
        agentId: event.args.agentId,
        reviewer: event.args.reviewer,
        score: Number(event.args.score),
        comment: "", // Comment not available in event
        timestamp: event.block.timestamp,
    });
});


ponder.on("AgentValidationRegistry:TaskSubmitted", async ({ event, context }) => {
    await context.db.insert(Validation).values({
        id: event.args.taskId.toString(),
        taskId: event.args.taskId,
        agentId: event.args.agentId,
        isValidated: false,
        isValid: false,
        validator: "0x0000000000000000000000000000000000000000",
    });
});

ponder.on("AgentValidationRegistry:TaskValidated", async ({ event, context }) => {
    await context.db.update(Validation, { id: event.args.taskId.toString() }).set({
        isValidated: true,
        isValid: event.args.isValid,
        validator: event.args.validator,
    });
});

ponder.on("AgentJuryRegistry:JurorRegistered", async ({ event, context }) => {
    await context.db.insert(Juror).values({
        address: event.args.juror,
        stakedAmount: event.args.stakedAmount,
        isRegistered: true,
    });
});

ponder.on("AgentJuryRegistry:DisputeCreated", async ({ event, context }) => {
    await context.db.insert(Dispute).values({
        id: event.args.disputeId,
        taskId: event.args.taskId,
        challenger: event.args.challenger,
        votesFor: 0n,
        votesAgainst: 0n,
        resolved: false,
        ruling: false,
    });

    // Link validation to dispute
    await context.db.update(Validation, { id: event.args.taskId.toString() }).set({
        disputeId: event.args.disputeId,
    });
});

ponder.on("AgentJuryRegistry:VoteCast", async ({ event, context }) => {
    const dispute = await context.db.find(Dispute, { id: event.args.disputeId });
    if (!dispute) return;

    if (event.args.support) {
        await context.db.update(Dispute, { id: event.args.disputeId }).set({
            votesFor: dispute.votesFor + 1n,
        });
    } else {
        await context.db.update(Dispute, { id: event.args.disputeId }).set({
            votesAgainst: dispute.votesAgainst + 1n,
        });
    }
});

ponder.on("AgentJuryRegistry:RulingExecuted", async ({ event, context }) => {
    await context.db.update(Dispute, { id: event.args.disputeId }).set({
        resolved: true,
        ruling: event.args.ruling,
    });
});

