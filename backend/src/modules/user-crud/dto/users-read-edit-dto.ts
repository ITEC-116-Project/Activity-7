import { ApiProperty } from "@nestjs/swagger";

export class ReadEditDto {
  @ApiProperty({ description: "Unique student identifier" })
  studentId: number;

  @ApiProperty({ description: "Student given name" })
  firstName: string;

  @ApiProperty({ description: "Student middle name" })
  middleName: string;

  @ApiProperty({ description: "Student last name" })
  lastName: string;

  @ApiProperty({ description: "Student email address" })
  email: string;

  @ApiProperty({ description: "Class section" })
  section: string;
}
