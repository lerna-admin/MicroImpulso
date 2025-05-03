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
exports.CashFlow = exports.CashFlowType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var CashFlowType;
(function (CashFlowType) {
    CashFlowType["INCOME"] = "INCOME";
    CashFlowType["EXPENSE"] = "EXPENSE";
})(CashFlowType || (exports.CashFlowType = CashFlowType = {}));
let CashFlow = class CashFlow {
    id;
    user;
    type;
    amount;
    description;
    createdAt;
};
exports.CashFlow = CashFlow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CashFlow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.cashFlows),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CashFlow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], CashFlow.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CashFlow.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], CashFlow.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CashFlow.prototype, "createdAt", void 0);
exports.CashFlow = CashFlow = __decorate([
    (0, typeorm_1.Entity)()
], CashFlow);
//# sourceMappingURL=cash-flow.entity.js.map