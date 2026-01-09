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
exports.ReadEditDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ReadEditDto {
    studentId;
    firstName;
    middleName;
    lastName;
    email;
    section;
}
exports.ReadEditDto = ReadEditDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unique student identifier" }),
    __metadata("design:type", Number)
], ReadEditDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Student given name" }),
    __metadata("design:type", String)
], ReadEditDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Student middle name" }),
    __metadata("design:type", String)
], ReadEditDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Student last name" }),
    __metadata("design:type", String)
], ReadEditDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Student email address" }),
    __metadata("design:type", String)
], ReadEditDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Class section" }),
    __metadata("design:type", String)
], ReadEditDto.prototype, "section", void 0);
//# sourceMappingURL=users-read-edit-dto.js.map