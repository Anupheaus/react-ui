export interface MatrixXYCategory<T = unknown> {
  id: string;
  value: T;
}

export interface MatrixCell<T = unknown> {
  id: string;
  xCategoryId: string;
  yCategoryId: string;
  value: T;
}
