"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const client_entity_1 = require("../entities/client.entity");
const loan_request_entity_1 = require("../entities/loan-request.entity");
const document_entity_1 = require("../entities/document.entity");
const chat_message_entity_1 = require("../entities/chat-message.entity");
const cash_flow_entity_1 = require("../entities/cash-flow.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [user_entity_1.User, client_entity_1.Client, loan_request_entity_1.LoanRequest, document_entity_1.Document, chat_message_entity_1.ChatMessage, cash_flow_entity_1.CashFlow],
});
//# sourceMappingURL=ormconfig.js.map