"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.ClientStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const loan_request_entity_1 = require("./loan-request.entity");
const document_entity_1 = require("./document.entity");
const chat_message_entity_1 = require("./chat-message.entity");
var ClientStatus;
(function (ClientStatus) {
    ClientStatus["ACTIVE"] = "ACTIVE";
    ClientStatus["INACTIVE"] = "INACTIVE";
    ClientStatus["SUSPENDED"] = "SUSPENDED";
    ClientStatus["PROSPECT"] = "PROSPECT";
})(ClientStatus || (exports.ClientStatus = ClientStatus = {}));
let Client = class Client {
    id;
    name;
    phone;
    email;
    status;
    agent;
    createdAt;
    updatedAt;
    loanRequests;
    documents;
    chatMessages;
};
exports.Client = Client;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Client.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.clients),
    (0, typeorm_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", user_entity_1.User)
], Client.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Client.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => loan_request_entity_1.LoanRequest, (loanRequest) => loanRequest.client),
    __metadata("design:type", Array)
], Client.prototype, "loanRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (document) => document.client),
    __metadata("design:type", Array)
], Client.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_message_entity_1.ChatMessage, (chatMessage) => chatMessage.client),
    __metadata("design:type", Array)
], Client.prototype, "chatMessages", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)()
], Client);
//# sourceMappingURL=client.entity.js.map