import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import type { UseFormReturn } from "react-hook-form";

interface HealthInfoFieldsProps {
  form: UseFormReturn<any>;
  isMinor: boolean;
  hasAllergies: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HealthInfoFields({
  form,
  isMinor,
  hasAllergies,
  onFileChange,
}: HealthInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="isMinor"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>É menor de 18 anos?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="sim" />
                  </FormControl>
                  <FormLabel className="font-normal">Sim</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="nao" />
                  </FormControl>
                  <FormLabel className="font-normal">Não</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isMinor && (
        <div className="space-y-2">
          <FormLabel>Upload da Autorização</FormLabel>
          <Input type="file" accept="image/*,.pdf" onChange={onFileChange} />
        </div>
      )}

      <FormField
        control={form.control}
        name="hasAllergies"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>É alérgico a algum medicamento ou alimento?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="sim" />
                  </FormControl>
                  <FormLabel className="font-normal">Sim</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="nao" />
                  </FormControl>
                  <FormLabel className="font-normal">Não</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {hasAllergies && (
        <FormField
          control={form.control}
          name="allergiesNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações sobre alergias</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva suas alergias aqui..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
