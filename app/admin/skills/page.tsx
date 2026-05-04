"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/components/shared/AdminModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency: 50,
  });

  const loadSkills = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApi("/skills");
      if (data?.data) {
        setSkills(Array.isArray(data.data) ? data.data : data.data.data || []);
      } else {
        setSkills([]);
      }
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openModal = (skill?: any) => {
    if (skill) {
      setCurrentSkill(skill);
      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        proficiency: skill.proficiency || 50,
      });
    } else {
      setCurrentSkill(null);
      setFormData({
        name: "",
        category: "",
        proficiency: 50,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEdit = !!currentSkill;
      const endpoint = isEdit ? `/skills/update/${currentSkill.id}` : "/skills/create";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        name: formData.name,
        category: formData.category,
        proficiency: Number(formData.proficiency),
      };

      const { error } = await fetchApi(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      if (error) throw new Error(error);

      toast.success(`Skill ${isEdit ? "updated" : "created"} successfully!`);
      setIsModalOpen(false);
      loadSkills();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    try {
      const { error } = await fetchApi(`/skills/${id}`, { method: "DELETE" });
      if (error) throw new Error(error);
      
      toast.success("Skill deleted successfully");
      loadSkills();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Skills</h1>
          <p className="text-slate-500">Add and organize your technical skills.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Skill Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Proficiency</th>
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
              ) : skills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No skills found. Create one.
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <p className="font-medium">{skill.name}</p>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {skill.category}
                    </td>
                    <td className="p-4">
                       <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                         {skill.proficiency}%
                       </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openModal(skill)} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors">
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
        title={currentSkill ? "Edit Skill" : "Add Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required placeholder="e.g. Frontend, Backend, Tools" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency (1-100)</Label>
            <Input id="proficiency" type="number" min="1" max="100" value={formData.proficiency} onChange={e => setFormData({...formData, proficiency: Number(e.target.value)})} required />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentSkill ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
