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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRequest = exports.LoanRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const client_entity_1 = require("./client.entity");
var LoanRequestStatus;
(function (LoanRequestStatus) {
    LoanRequestStatus["NEW"] = "NEW";
    LoanRequestStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    LoanRequestStatus["APPROVED"] = "APPROVED";
    LoanRequestStatus["REJECTED"] = "REJECTED";
    LoanRequestStatus["CANCELED"] = "CANCELED";
})(LoanRequestStatus || (exports.LoanRequestStatus = LoanRequestStatus = {}));
let LoanRequest = class LoanRequest {
    id;
    amount;
    status;
    client;
    createdAt;
    updatedAt;
};
exports.LoanRequest = LoanRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoanRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], LoanRequest.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], LoanRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.loanRequests),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", typeof (_a = typeof client_entity_1.Client !== "undefined" && client_entity_1.Client) === "function" ? _a : Object)
], LoanRequest.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LoanRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LoanRequest.prototype, "updatedAt", void 0);
exports.LoanRequest = LoanRequest = __decorate([
    (0, typeorm_1.Entity)()
], LoanRequest);
//# sourceMappingURL=loan-request.entity.js.map