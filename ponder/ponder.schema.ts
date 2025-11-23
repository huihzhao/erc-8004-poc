import { onchainTable, relations } from "@ponder/core";

export const Agent = onchainTable("Agent", (p) => ({
    id: p.bigint().primaryKey(), // Token ID
    address: p.hex(), // Use hex for addresses
    uri: p.text(),
}));

export const AgentRelations = relations(Agent, ({ many }) => ({
    services: many(Service),
    validations: many(Validation),
    reputations: many(Reputation),
}));

export const Service = onchainTable("Service", (p) => ({
    id: p.text().primaryKey(), // Service ID (string)
    agentId: p.bigint(), // Removed .references()
    metadataURI: p.text(),
    active: p.boolean(),
}));

export const ServiceRelations = relations(Service, ({ one }) => ({
    agent: one(Agent, {
        fields: [Service.agentId],
        references: [Agent.id],
    }),
}));

export const Reputation = onchainTable("Reputation", (p) => ({
    id: p.text().primaryKey(), // Unique ID (could be agentId-reviewer-timestamp)
    agentId: p.bigint(),
    reviewer: p.hex(),
    score: p.integer(),
    comment: p.text(),
    timestamp: p.bigint(),
}));

export const ReputationRelations = relations(Reputation, ({ one }) => ({
    agent: one(Agent, {
        fields: [Reputation.agentId],
        references: [Agent.id],
    }),
}));

export const Validation = onchainTable("Validation", (p) => ({
    id: p.text().primaryKey(),
    taskId: p.bigint(),
    agentId: p.bigint(), // Removed .references()
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

export const Juror = onchainTable("Juror", (p) => ({
    address: p.hex().primaryKey(),
    stakedAmount: p.bigint(),
    isRegistered: p.boolean(),
}));

