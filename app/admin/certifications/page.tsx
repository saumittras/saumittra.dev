"use client";

import { AdminModal } from "@/components/shared/AdminModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api";
import { Edit2, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    year: new Date().getFullYear(),
    url: "",
  });

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApi("/certifications");
      if (data?.data) {
        setCertifications(
          Array.isArray(data.data) ? data.data : data.data.data || [],
        );
      } else {
        setCertifications([]);
      }
    } catch (error) {
      toast.error("Failed to fetch certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const openModal = (cert?: any) => {
    if (cert) {
      setCurrentCert(cert);
      setFormData({
        title: cert.title || "",
        provider: cert.provider || "",
        year: cert.year || new Date().getFullYear(),
        url: cert.url || "",
      });
    } else {
      setCurrentCert(null);
      setFormData({
        title: "",
        provider: "",
        year: new Date().getFullYear(),
        url: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEdit = !!currentCert;
      const endpoint = isEdit
        ? `/certifications/update/${currentCert.id}`
        : "/certifications/create";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        title: formData.title,
        provider: formData.provider,
        year: Number(formData.year),
        url: formData.url
          ? formData.url.startsWith("http")
            ? formData.url
            : `https://${formData.url}`
          : "",
      };

      const { error } = await fetchApi(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (error) throw new Error(error);

      toast.success(
        `Certification ${isEdit ? "updated" : "created"} successfully!`,
      );
      setIsModalOpen(false);
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      const { error } = await fetchApi(`/certifications/${id}`, {
        method: "DELETE",
      });
      if (error) throw new Error(error);

      toast.success("Certification deleted successfully");
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Certifications
          </h1>
          <p className="text-slate-500">
            Add and organize your professional certifications.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Certification Title</th>
                <th className="p-4 font-medium">Provider</th>
                <th className="p-4 font-medium">Year</th>
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
              ) : certifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No certifications found. Create one.
                  </td>
                </tr>
              ) : (
                certifications.map((cert) => (
                  <tr
                    key={cert.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{cert.title}</p>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {cert.provider}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        {cert.year}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-green-600 bg-slate-100 hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => openModal(cert)}
                          className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
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
        title={currentCert ? "Edit Certification" : "Add Certification"}
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
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max="2100"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL (optional)</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
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
              {currentCert ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
