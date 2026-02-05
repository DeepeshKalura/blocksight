'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type Dao } from './DaoCard';

const formSchema = z.object({
  contractAddress: z.string().refine(ethers.isAddress, {
    message: "Please enter a valid Ethereum address.",
  }),
  daoName: z.string().min(3, {
    message: "DAO name must be at least 3 characters.",
  }).optional(),
});

interface AddDaoDrawerProps {
  onDaoAdded: (dao: Dao) => void;
  children: React.ReactNode; 
}

export function AddDaoDrawer({ onDaoAdded, children }: AddDaoDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: '',
      daoName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // --- THIS IS THE FRONTEND-ONLY MOCK LOGIC ---
    console.log("Submitting new DAO:", values);
    
    // Here, you'd normally call your FastAPI backend.
    // The backend would then auto-fill the name and logo.
    // For now, we'll fake it.
    
    const name = values.daoName || `DAO (${values.contractAddress.slice(0, 6)}...)`;
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
    
    const newDao: Dao = {
      id: values.contractAddress,
      name: name,
      logo_url: "/puck-logo.png", // Use a placeholder logo
      chain: "Ethereum",
      contract_address: values.contractAddress,
      description: "",
      status: "PENDING",
      slug: slug
    };
    
    onDaoAdded(newDao);
    form.reset();
    setIsOpen(false); 
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="bg-black border-gray-800 text-white">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add a New DAO for Analysis</DrawerTitle>
            <DrawerDescription>
              Enter the DAO&apos;s governance contract address. We&apos;ll try to find the rest.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="contractAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governor Contract Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0x..." 
                          className="bg-gray-800 border-gray-700 font-mono"
                          {...field} />
                      </FormControl>
                      <FormDescription>
                        You can find this on the DAO&apos;s website or Tally.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DAO Name (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Karratco DAO" 
                          className="bg-gray-800 border-gray-700"
                          {...field} />
                      </FormControl>
                       <FormDescription>
                        We&apos;ll try to auto-detect this if you leave it blank.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Submit for Indexing</Button>
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}