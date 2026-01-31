"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Plus, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, Project } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Image as ImageIcon, Map, Pencil, Trash2, AlertTriangle } from "lucide-react";

const projectColors = [
  "bg-blue-500/10 border-blue-500/20 text-blue-500",
  "bg-purple-500/10 border-purple-500/20 text-purple-500",
  "bg-green-500/10 border-green-500/20 text-green-500",
  "bg-amber-500/10 border-amber-500/20 text-amber-500",
  "bg-pink-500/10 border-pink-500/20 text-pink-500",
  "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
];

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<"all" | "sprite" | "scene">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedType, setSelectedType] = useState<"sprite" | "scene">("sprite");
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Rename modal state
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.projects.list();
      if (response && response.projects) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = currentFilter === "all" || p.type === currentFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Open delete confirmation modal
  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  // Optimistic delete with rollback
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    const projectId = projectToDelete.id;
    const previousProjects = [...projects];

    // Optimistically remove from UI immediately
    setProjects(projects.filter((p) => p.id !== projectId));
    setDeleteModalOpen(false);
    setIsDeleting(true);

    try {
      await api.projects.delete(projectId);
    } catch (error) {
      console.error("Failed to delete project:", error);
      // Rollback on error
      setProjects(previousProjects);
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  // Open rename modal
  const handleRenameClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setProjectToRename(project);
    setRenameValue(project.title);
    setRenameModalOpen(true);
  };

  // Optimistic rename with rollback
  const confirmRename = async () => {
    if (!projectToRename || !renameValue.trim()) return;

    const projectId = projectToRename.id;
    const previousProjects = [...projects];
    const newTitle = renameValue.trim();

    // Optimistically update UI immediately
    setProjects(projects.map((p) =>
      p.id === projectId ? { ...p, title: newTitle } : p
    ));
    setRenameModalOpen(false);
    setIsRenaming(true);

    try {
      await api.projects.update(projectId, { title: newTitle });
    } catch (error) {
      console.error("Failed to rename project:", error);
      // Rollback on error
      setProjects(previousProjects);
    } finally {
      setIsRenaming(false);
      setProjectToRename(null);
      setRenameValue("");
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const response = await api.projects.create({
        title: newProjectName.trim(),
        type: selectedType,
        color: projectColors[Math.floor(Math.random() * projectColors.length)],
        settings: {}, // Default settings
      });

      if (response && response.project) {
        setProjects([response.project, ...projects]);
        setIsNewProjectOpen(false);
        setNewProjectName("");

        if (selectedType === "sprite") {
          router.push(`/sprites?projectId=${response.project.id}`);
        } else {
          router.push(`/scenes?projectId=${response.project.id}`);
        }
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Import logic would go here. For now it's just a UI placeholder or could create projects from files.
    // Simplifying for this integration step.
    console.log("Import not fully implemented with backend yet");
  };

  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary/30">
      <Sidebar />

      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto app-scroll px-4 md:px-12 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto pt-8 pb-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Projects</h1>
                <p className="text-sm text-text-muted">Manage your game assets</p>
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
                <Button size="sm" onClick={() => setIsNewProjectOpen(true)}>
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 p-1 bg-surface-highlight rounded-lg w-fit">
                <Button
                  onClick={() => setCurrentFilter("all")}
                  variant="ghost"
                  size="sm"
                  className={currentFilter === "all" ? "bg-surface shadow-sm text-primary" : ""}
                >
                  All
                </Button>
                <Button
                  onClick={() => setCurrentFilter("sprite")}
                  variant="ghost"
                  size="sm"
                  className={currentFilter === "sprite" ? "bg-surface shadow-sm text-primary" : ""}
                >
                  Sprites
                </Button>
                <Button
                  onClick={() => setCurrentFilter("scene")}
                  variant="ghost"
                  size="sm"
                  className={currentFilter === "scene" ? "bg-surface shadow-sm text-primary" : ""}
                >
                  Scenes
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card className="py-16">
                <CardContent className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                  <p className="text-sm text-text-muted mb-4">
                    Try adjusting your filters or create a new project
                  </p>
                  <Button onClick={() => setIsNewProjectOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Card
                  className="group cursor-pointer border-dashed hover:border-primary hover:bg-primary/10 transition-colors"
                  onClick={() => setIsNewProjectOpen(true)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                    <div className="w-12 h-12 rounded-xl bg-surface-highlight group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
                      <Plus className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-medium text-text-muted group-hover:text-primary transition-colors">
                      New Project
                    </h3>
                    <p className="text-xs text-text-muted mt-1">Create a sprite or scene</p>
                  </CardContent>
                </Card>

                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="group cursor-pointer hover:shadow-md transition-all overflow-hidden"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <div className={`h-40 ${project.thumbnail_url ? 'bg-background' : project.color || 'bg-gray-500'} grid-pattern relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-contain p-4 pixelated"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {project.type === "sprite" ? (
                            <ImageIcon className="w-12 h-12 text-white/80" />
                          ) : (
                            <Map className="w-12 h-12 text-white/80" />
                          )}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-xs text-text-muted mt-1">
                            {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleRenameClick(e, project)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                            onClick={(e) => handleDeleteClick(e, project)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium capitalize">
                          {project.type}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Choose the type of asset you want to create
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`cursor-pointer transition-all ${selectedType === "sprite"
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedType("sprite")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <ImageIcon className="w-8 h-8 mb-2 text-primary" />
                    <h4 className="font-medium">Sprite</h4>
                    <p className="text-xs text-text-muted mt-1">Character or object</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${selectedType === "scene"
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedType("scene")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Map className="w-8 h-8 mb-2 text-primary" />
                    <h4 className="font-medium">Scene</h4>
                    <p className="text-xs text-text-muted mt-1">Environment or level</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProject();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim() || isCreating}>
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              Delete Project
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <span className="font-semibold text-text">{projectToDelete?.title}</span>? This action cannot be undone and all associated assets will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onOpenChange={setRenameModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Project name..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && renameValue.trim()) {
                  confirmRename();
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRename}
              disabled={!renameValue.trim() || renameValue.trim() === projectToRename?.title}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
