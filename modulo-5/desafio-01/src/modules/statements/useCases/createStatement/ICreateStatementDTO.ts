export type ICreateStatementDTO = {
  user_id: string;
  receiver_id?: string;
  description: string;
  amount: number;
  type: string;
};
