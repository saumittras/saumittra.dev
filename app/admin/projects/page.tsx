"use client";

import { AdminModal } from "@/components/shared/AdminModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, fetchApi } from "@/lib/api";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    githubUrl: "",
    liveUrl: "",
    techStack: "",
    featured: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApi("/project");
      if (data?.data) {
        setProjects(
          Array.isArray(data.data) ? data.data : data.data.data || [],
        );
      } else {
        setProjects([]);
      }
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openModal = (project?: any) => {
    if (project) {
      setCurrentProject(project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        category: project.category || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        techStack: project.techStack?.join(", ") || "",
        featured: project.featured || false,
      });
    } else {
      setCurrentProject(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        githubUrl: "",
        liveUrl: "",
        techStack: "",
        featured: false,
      });
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEdit = !!currentProject;
      const endpoint = isEdit
        ? `/project/update/${currentProject.id}`
        : "/project/create";
      const method = isEdit ? "PATCH" : "POST";

      const payloadData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        githubUrl: formData.githubUrl
          ? formData.githubUrl.startsWith("http")
            ? formData.githubUrl
            : `https://${formData.githubUrl}`
          : "",
        liveUrl: formData.liveUrl
          ? formData.liveUrl.startsWith("http")
            ? formData.liveUrl
            : `https://${formData.liveUrl}`
          : "",
        techStack: formData.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured: formData.featured,
      };

      const submitData = new FormData();
      submitData.append("data", JSON.stringify(payloadData));
      if (file) {
        submitData.append("file", file);
      }

      // We need to omit Content-Type header so browser sets it with boundary for FormData
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
        body: submitData,
      });

      const resData = await res.json();

      if (!res.ok) {
        let errorMessage = resData.message || "Failed to save project";
        if (resData.errorSources && resData.errorSources.length > 0) {
          errorMessage = resData.errorSources
            .map((e: any) => e.message)
            .join(", ");
        }
        throw new Error(errorMessage);
      }

      toast.success(`Project ${isEdit ? "updated" : "created"} successfully!`);
      setIsModalOpen(false);
      loadProjects();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await fetchApi(`/project/${id}`, { method: "DELETE" });
      if (error) throw new Error(error);

      toast.success("Project deleted successfully");
      loadProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Projects</h1>
          <p className="text-slate-500">
            Create, edit, and organize your portfolio projects.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Project Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={24}
                    />
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No projects found. Create one.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{project.title}</p>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {project.category}
                    </td>
                    <td className="p-4">
                      {project.featured ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                          Featured
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openModal(project)}
                          className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
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
        title={currentProject ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
              <Input
                id="techStack"
                value={formData.techStack}
                onChange={(e) =>
                  setFormData({ ...formData, techStack: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {currentProject ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
