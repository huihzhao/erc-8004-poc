import { onchainTable, relations } from "@ponder/core";

export const Agent = onchainTable("Agent", (p) => ({
    id: p.bigint().primaryKey(), // Token ID
    address: p.hex(), // Use hex for addresses
    uri: p.text(),
}));

export const AgentRelations = relations(Agent, ({ many }) => ({
    services: many(Service),
    validations: many(Validation),
}));

export const Service = onchainTable("Service", (p) => ({
    id: p.text().primaryKey(), // Service ID (string)
    agentId: p.bigint().references(() => Agent.id),
    metadataURI: p.text(),
    active: p.boolean(),
}));

export const ServiceRelations = relations(Service, ({ one }) => ({
    agent: one(Agent, {
        fields: [Service.agentId],
        references: [Agent.id],
    }),
}));

export const Validation = onchainTable("Validation", (p) => ({
    id: p.text().primaryKey(),
    taskId: p.bigint(),
    agentId: p.bigint().references(() => Agent.id),
    isValidated: p.boolean(),
    isValid: p.boolean(),
    validator: p.hex(),
    disputeId: p.bigint(), // Optional by default?
}));

export const ValidationRelations = relations(Validation, ({ one }) => ({
    agent: one(Agent, {
        fields: [Validation.agentId],
        references: [Agent.id],
    }),
}));

export const Dispute = onchainTable("Dispute", (p) => ({
    id: p.bigint().primaryKey(),
    taskId: p.bigint(),
    challenger: p.hex(),
    votesFor: p.bigint(),
    votesAgainst: p.bigint(),
    resolved: p.boolean(),
    ruling: p.boolean(),
}));



