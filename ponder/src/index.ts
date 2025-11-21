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
