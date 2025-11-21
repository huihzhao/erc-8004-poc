import { onchainSchema } from "@ponder/core";

export default onchainSchema((p) => ({
    Agent: p.createTable({
        id: p.bigint(), // Token ID
        address: p.string(),
        uri: p.string(),
        services: p.many("Service.agentId"),
        validations: p.many("Validation.agentId"),
    }),
    Service: p.createTable({
        id: p.string(), // Service ID (string)
        agentId: p.bigint().references("Agent.id"),
        metadataURI: p.string(),
        active: p.boolean(),
    }),
    Validation: p.createTable({
        id: p.string(),
        taskId: p.bigint(),
        agentId: p.bigint().references("Agent.id"),
        isValidated: p.boolean(),
        isValid: p.boolean(),
        validator: p.string(),
    }),
}));
