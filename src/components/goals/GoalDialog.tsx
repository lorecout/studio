"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Goal } from "@/types/goal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useEffect } from "react";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<Goal, "id" | "currentAmount" | "userId"> & { initialAmount: number }) => void;
  goalToEdit: Goal | null;
}

const goalSchema = z.object({
  name: z.string().min(1, { message: "O nome da meta é obrigatório." }),
  totalAmount: z.coerce.number().min(1, { message: "O valor total deve ser maior que zero." }),
  initialAmount: z.coerce.number().min(0).optional().default(0),
  deadline: z.date({ required_error: "A data final é obrigatória." }),
});

type GoalFormData = z.infer<typeof goalSchema>;

export default function GoalDialog({ open, onOpenChange, onSave, goalToEdit }: GoalDialogProps) {
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      totalAmount: 0,
      initialAmount: 0,
    },
  });

  useEffect(() => {
    if (goalToEdit) {
      form.reset({
        name: goalToEdit.name,
        totalAmount: goalToEdit.totalAmount,
        initialAmount: goalToEdit.currentAmount,
        deadline: new Date(goalToEdit.deadline),
      });
    } else {
      form.reset({
        name: "",
        totalAmount: undefined,
        initialAmount: 0,
        deadline: undefined,
      });
    }
  }, [goalToEdit, form, open]);
  
  const onSubmit = (data: GoalFormData) => {
    onSave({
        ...data,
        deadline: data.deadline.toISOString()
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goalToEdit ? "Editar Meta" : "Criar Nova Meta"}</DialogTitle>
          <DialogDescription>
            {goalToEdit ? "Atualize os detalhes da sua meta." : "Defina os detalhes da sua nova meta financeira."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Férias no Japão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="20000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="initialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Inicial (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} disabled={!!goalToEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Prazo Final</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={!form.formState.isDirty || !form.formState.isValid}>Salvar Meta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
