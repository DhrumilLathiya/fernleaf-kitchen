import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private employeesService;
    constructor(employeesService: EmployeesService);
    getAll(companyId?: string): Promise<({
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
    })[]>;
    getOne(id: string): Promise<({
        company: {
            priceTier: {
                id: string;
                name: string;
                isDefault: boolean;
                derivedFrom: string | null;
            } | null;
        } & {
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
    }) | null>;
    create(body: any): Promise<{
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
    }>;
    update(id: string, body: any): Promise<{
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
    }>;
}
