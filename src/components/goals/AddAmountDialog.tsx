"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useEffect } from "react";

interface AddAmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (amount: number) => void;
  goalName: string;
}

const addAmountSchema = z.object({
  amount: z.coerce.number().positive({ message: "O valor deve ser positivo." }),
});

type AddAmountFormData = z.infer<typeof addAmountSchema>;

export default function AddAmountDialog({ open, onOpenChange, onSave, goalName }: AddAmountDialogProps) {
  const form = useForm<AddAmountFormData>({
    resolver: zodResolver(addAmountSchema),
    defaultValues: {
      amount: undefined,
    }
  });

  useEffect(() => {
    if(open) {
        form.reset();
    }
  }, [open, form]);

  const onSubmit = (data: AddAmountFormData) => {
    onSave(data.amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Valor à Meta</DialogTitle>
          <DialogDescription>
            Quanto você quer adicionar para a meta "{goalName}"?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor a Adicionar (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={!form.formState.isValid}>Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
