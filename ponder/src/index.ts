import { ponder } from "@/generated";

ponder.on("AgentIdentityRegistry:AgentRegistered", async ({ event, context }) => {
    const { Agent } = context.db;
    await Agent.create({
        id: event.args.tokenId,
        data: {
            address: event.args.agentAddress,
            uri: event.args.uri,
        },
    });
});

ponder.on("AgentServiceRegistry:ServiceRegistered", async ({ event, context }) => {
    const { Service } = context.db;
    await Service.create({
        id: event.args.serviceId,
        data: {
            agentId: event.args.agentId,
            metadataURI: event.args.metadataURI,
            active: true,
        },
    });
});

ponder.on("AgentServiceRegistry:ServiceUpdated", async ({ event, context }) => {
    const { Service } = context.db;
    await Service.update({
        id: event.args.serviceId,
        data: {
            metadataURI: event.args.metadataURI,
        },
    });
});

ponder.on("AgentValidationRegistry:TaskSubmitted", async ({ event, context }) => {
    const { Validation } = context.db;
    await Validation.create({
        id: event.args.taskId.toString(),
        data: {
            taskId: event.args.taskId,
            agentId: event.args.agentId,
            isValidated: false,
            isValid: false,
            validator: "0x0000000000000000000000000000000000000000",
        },
    });
});

ponder.on("AgentValidationRegistry:TaskValidated", async ({ event, context }) => {
    const { Validation } = context.db;
    await Validation.update({
        id: event.args.taskId.toString(),
        data: {
            isValidated: true,
            isValid: event.args.isValid,
            validator: event.args.validator,
        },
    });
});

ponder.on("AgentJuryRegistry:DisputeCreated", async ({ event, context }) => {
    const { Dispute, Validation } = context.db;
    await Dispute.create({
        id: event.args.disputeId,
        data: {
            taskId: event.args.taskId,
            challenger: event.args.challenger,
            votesFor: 0n,
            votesAgainst: 0n,
            resolved: false,
            ruling: false,
        },
    });

    // Link validation to dispute
    await Validation.update({
        id: event.args.taskId.toString(),
        data: {
            disputeId: event.args.disputeId,
        },
    });
});

ponder.on("AgentJuryRegistry:VoteCast", async ({ event, context }) => {
    const { Dispute } = context.db;
    const dispute = await Dispute.findUnique({ id: event.args.disputeId });
    if (!dispute) return;

    if (event.args.support) {
        await Dispute.update({
            id: event.args.disputeId,
            data: { votesFor: dispute.votesFor + 1n },
        });
    } else {
        await Dispute.update({
            id: event.args.disputeId,
            data: { votesAgainst: dispute.votesAgainst + 1n },
        });
    }
});

ponder.on("AgentJuryRegistry:RulingExecuted", async ({ event, context }) => {
    const { Dispute } = context.db;
    await Dispute.update({
        id: event.args.disputeId,
        data: {
            resolved: true,
            ruling: event.args.ruling,
        },
    });
});
