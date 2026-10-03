import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.StaffRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(user: {
        id: string;
        email: string;
        role: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
}
