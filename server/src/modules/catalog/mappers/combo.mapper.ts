import { plainToInstance } from "class-transformer";
import { Combo } from "../entities/combo.entity";
import { ComboItem } from "../entities/combo-item.entity";
import { ComboDto, ComboItemDto } from "../dtos/combo.dto";

export class ComboMapper {
    static toComboDto(combo: Combo): ComboDto {
        const comboDto = plainToInstance(ComboDto, combo, { excludeExtraneousValues: true });
        if (combo.comboItems) {
            comboDto.comboItems = combo.comboItems.map(item => plainToInstance(ComboItemDto, item, { excludeExtraneousValues: true }));
        }
        return comboDto;
    }

    static toComboDtos(combos: Combo[]): ComboDto[] {
        return combos.map(combo => this.toComboDto(combo));
    }

    static toComboItemDto(comboItem: ComboItem): ComboItemDto {
        return plainToInstance(ComboItemDto, comboItem, { excludeExtraneousValues: true });
    }

    static toComboItemDtos(comboItems: ComboItem[]): ComboItemDto[] {
        return comboItems.map(item => this.toComboItemDto(item));
    }
}