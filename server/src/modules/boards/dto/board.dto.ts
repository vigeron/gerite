export class BoardDto {
  readonly name: string;
  readonly slug: string;
  readonly createdBy: string;
  readonly members: string[];
  readonly background: string;
  readonly createdAt: Date;
}
