import type * as React from "react";
import { periods, type PeriodValue } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { Icon } from "@/components/icon";

export function PeriodSelect({
  value,
  onChange,
  variant = "outline",
  label = "Time range",
}: {
  value: PeriodValue;
  onChange: (value: PeriodValue) => void;
  variant?: "outline" | "surface";
  label?: string;
}): React.ReactElement {
  const current = periods.find((period) => period.value === value)!;
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            aria-label={`${label}: ${current.label}`}
            className="group/ps w-[117px] justify-between"
            variant={variant}
          />
        }
      >
        <span className="flex items-center gap-1.5">
          <Icon name="calendar" />
          <span className="animate-fade" key={current.value}>
            {current.label}
          </span>
        </span>
        <Icon
          className={cn(
            "transition-transform duration-200 group-data-[popup-open]/ps:rotate-180",
          )}
          name="arrow-down"
          size={12}
        />
      </MenuTrigger>
      <MenuPopup align="end" className="w-44">
        <MenuRadioGroup
          onValueChange={(next) => onChange(next as PeriodValue)}
          value={value}
        >
          <MenuGroupLabel>{label}</MenuGroupLabel>
          {periods.map((period) => (
            <MenuRadioItem closeOnClick key={period.value} value={period.value}>
              {period.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  );
}
