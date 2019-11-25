export class ListDto {
  readonly name: string;
  readonly boardId: number;
  readonly order: number;
  readonly done: boolean;
  readonly archived: boolean;
  readonly createdBy: string;
  readonly createdAt: Date;
}
