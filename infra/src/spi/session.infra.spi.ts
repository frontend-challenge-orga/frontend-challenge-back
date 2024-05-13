import { SessionSpi } from '@monorepo/domain';
import { PrismaClient } from '@prisma/client';

export class SessionInfraSpi implements SessionSpi {
  private sessionRepository: PrismaClient;

  constructor(dataSource: PrismaClient) {
    this.sessionRepository = dataSource;
  }

  async index() {
    return this.sessionRepository.session.findMany();
  }

  async findByUserId(userId: string) {
    return this.sessionRepository.session.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
