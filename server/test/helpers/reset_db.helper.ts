import { DataSource } from 'typeorm';

export const resetDatabase = async (dataSource: DataSource) => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const tableNames = dataSource.entityMetadatas
    .map((entity) => `"${entity.tableName}"`)
    .join(', ');

  await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
};
