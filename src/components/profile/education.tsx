'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/auth-helpers-nextjs';
import { toast, Toaster } from 'sonner';

import { Database } from '@/types/supabase';

type Education = Partial<Database['public']['Tables']['education']['Row']>;

export default function EducationSection({ user }: { user: User | null }) {
  const supabase = createClientComponentClient();
  const [educations, setEducations] = useState<Education[]>([]);
  const [originalIds, setOriginalIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchEducation = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('educations')
        .select('*')
        .eq('profileid', user.id);

      if (error) {
        toast.error('Failed to load education');
        console.error('Supabase fetch error:', error);
      } else {
        setEducations(data || []);
        setOriginalIds((data || []).map((edu) => edu.id).filter(Boolean) as number[]);
      }
    };

    fetchEducation();
  }, [user]);

  const handleChange = (
    index: number,
    field: keyof Omit<Education, 'id' | 'profileid' | 'created_at'>,
    value: string
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const addEducation = () =>
    setEducations([
      ...educations,
      {
        school: '',
        degree: '',
        major: '',
        minor: '',
        gpa: '',
        startDate: '',
        endDate: '',
        coursework: '',
      },
    ]);

  const deleteEducation = (index: number) => {
    const updated = [...educations];
    updated.splice(index, 1);
    setEducations(updated);
  };

  const saveEducations = async () => {
    if (!user) return;

    const currentIds = educations.map((e) => e.id).filter(Boolean) as number[];
    const deletedIds = originalIds.filter((id) => !currentIds.includes(id));

    if (deletedIds.length > 0) {
      const { error: delError } = await supabase
        .from('educations')
        .delete()
        .in('id', deletedIds);

      if (delError) {
        toast.error('Failed to delete entries');
        console.error(delError);
        return;
      }
    }

    const toUpsert = educations.map((edu) => ({
      ...edu,
      profileid: user.id,
    }));

    const { error: upsertError } = await supabase.from('educations').upsert(toUpsert);

    if (upsertError) {
      toast.error('Failed to save education info');
      console.error(upsertError);
    } else {
      toast.success('Education saved successfully!');
      const { data: refreshed } = await supabase
        .from('educations')
        .select('*')
        .eq('profileid', user.id);
      setEducations(refreshed || []);
      setOriginalIds((refreshed || []).map((e) => e.id).filter(Boolean) as number[]);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <Label className="text-lg font-semibold">Education</Label>

      {educations.map((edu, index) => (
        <div key={index} className="relative space-y-4 border p-4 rounded-md">
          {educations.length > 1 && (
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => deleteEducation(index)}
              aria-label="Delete education entry"
            >
              <X size={16} />
            </button>
          )}

          <div className="space-y-2">
            <Label>School</Label>
            <Input
              value={edu.school || ''}
              onChange={(e) => handleChange(index, 'school', e.target.value)}
              placeholder="e.g., Stanford University"
            />
          </div>

          <div className="space-y-2">
            <Label>Degree</Label>
            <select
              value={edu.degree || ''}
              onChange={(e) => handleChange(index, 'degree', e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select degree</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Major</Label>
              <Input
                value={edu.major || ''}
                onChange={(e) => handleChange(index, 'major', e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Minor <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                value={edu.minor || ''}
                onChange={(e) => handleChange(index, 'minor', e.target.value)}
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>GPA</Label>
            <Input
              value={edu.gpa || ''}
              onChange={(e) => handleChange(index, 'gpa', e.target.value)}
              placeholder="e.g., 3.8 / 4.0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={edu.startDate || ''}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                placeholder="e.g., 08 2020"
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation Date / Expected</Label>
              <Input
                value={edu.endDate || ''}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                placeholder="e.g., 05 2024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Relevant Coursework <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              rows={3}
              value={edu.coursework || ''}
              onChange={(e) => handleChange(index, 'coursework', e.target.value)}
              placeholder="List relevant classes separated by commas…"
            />
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="default" onClick={addEducation}>Add Another Education</Button>
        <Button variant="secondary" onClick={saveEducations}>Save All Education</Button>
      </div>
    </div>
  );
}