import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMetrics(role: string): Promise<{
        todayOrders: number;
        inKitchen: number;
        stations: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CombinationGroupByOutputType, "kitchenStation"[]> & {
            _count: number;
        })[];
        readyToDispatch?: undefined;
        myDeliveries?: undefined;
        outstanding?: undefined;
        recentOrders?: undefined;
    } | {
        todayOrders: number;
        readyToDispatch: number;
        inKitchen?: undefined;
        stations?: undefined;
        myDeliveries?: undefined;
        outstanding?: undefined;
        recentOrders?: undefined;
    } | {
        myDeliveries: number;
        todayOrders?: undefined;
        inKitchen?: undefined;
        stations?: undefined;
        readyToDispatch?: undefined;
        outstanding?: undefined;
        recentOrders?: undefined;
    } | {
        todayOrders: number;
        inKitchen: number;
        readyToDispatch: number;
        outstanding: number;
        recentOrders: ({
            employee: {
                company: {
                    id: string;
                    name: string;
                    emailDomains: string[];
                    deliveryAddresses: string[];
                    billingContact: string;
                    ownerId: string | null;
                    priceTierId: string | null;
                    defaultDeliveryTime: string | null;
                    deliveryMinutes: number;
                    defaultPackaging: string | null;
                    driverInstructions: string | null;
                    defaultDriverId: string | null;
                    hiddenCategoryIds: string[];
                    hiddenDishIds: string[];
                };
            } & {
                id: string;
                email: string;
                allergens: string[];
                dietaryTags: string[];
                firstName: string;
                lastName: string;
                companyId: string;
                canChooseAddress: boolean;
                canChangeTime: boolean;
                canChangePackaging: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            employeeId: string;
            deliveryDate: Date;
            deliveryTime: string;
            deliveryAddress: string;
            packaging: string;
            totalAmount: number;
            kitchenStartedAt: Date | null;
            kitchenReadyAt: Date | null;
            dispatchReadyAt: Date | null;
            outForDeliveryAt: Date | null;
            deliveredAt: Date | null;
            driverId: string | null;
            deliveryNote: string | null;
            deliveryPhoto: string | null;
            isOnTime: boolean | null;
            invoiceId: string | null;
        })[];
        stations?: undefined;
        myDeliveries?: undefined;
    }>;
}
