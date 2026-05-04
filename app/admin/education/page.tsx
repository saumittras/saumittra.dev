"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Plus, Edit2, Trash2, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/components/shared/AdminModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminEducation() {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
    description: "",
  });

  const loadEducations = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApi("/educations");
      if (data?.data) {
        setEducations(Array.isArray(data.data) ? data.data : data.data.data || []);
      } else {
        setEducations([]);
      }
    } catch (error) {
      toast.error("Failed to fetch education records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducations();
  }, []);

  const openModal = (edu?: any) => {
    if (edu) {
      setCurrentEdu(edu);
      setFormData({
        institution: edu.institution || "",
        degree: edu.degree || "",
        startYear: edu.startYear || new Date().getFullYear() - 4,
        endYear: edu.endYear || new Date().getFullYear(),
        description: edu.description || "",
      });
    } else {
      setCurrentEdu(null);
      setFormData({
        institution: "",
        degree: "",
        startYear: new Date().getFullYear() - 4,
        endYear: new Date().getFullYear(),
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEdit = !!currentEdu;
      const endpoint = isEdit ? `/educations/update/${currentEdu.id}` : "/educations/create";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        institution: formData.institution,
        degree: formData.degree,
        startYear: Number(formData.startYear),
        endYear: formData.endYear ? Number(formData.endYear) : null,
        description: formData.description,
      };

      const { error } = await fetchApi(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      if (error) throw new Error(error);

      toast.success(`Education record ${isEdit ? "updated" : "created"} successfully!`);
      setIsModalOpen(false);
      loadEducations();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const { error } = await fetchApi(`/educations/${id}`, { method: "DELETE" });
      if (error) throw new Error(error);
      
      toast.success("Education record deleted successfully");
      loadEducations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Education</h1>
          <p className="text-slate-500">Add and manage your educational background.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Add Education</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Degree / Program</th>
                <th className="p-4 font-medium">Institution</th>
                <th className="p-4 font-medium">Years</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={24} />
                  </td>
                </tr>
              ) : educations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No education records found. Create one.
                  </td>
                </tr>
              ) : (
                educations.map((edu) => (
                  <tr key={edu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                          <GraduationCap size={16} />
                        </div>
                        <p className="font-medium">{edu.degree}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {edu.institution}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {edu.startYear} - {edu.endYear || "Present"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openModal(edu)} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(edu.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentEdu ? "Edit Education" : "Add Education"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degree">Degree / Program</Label>
            <Input id="degree" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startYear">Start Year</Label>
              <Input id="startYear" type="number" min="1900" max="2100" value={formData.startYear} onChange={e => setFormData({...formData, startYear: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endYear">End Year (optional)</Label>
              <Input id="endYear" type="number" min="1900" max="2100" value={formData.endYear || ""} onChange={e => setFormData({...formData, endYear: e.target.value ? Number(e.target.value) : 0})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentEdu ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
