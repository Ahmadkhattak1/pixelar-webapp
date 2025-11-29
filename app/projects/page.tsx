"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Upload, Image as ImageIcon, Map, Pencil, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ProfileModal } from "@/components/profile-modal";

type Project = {
  id: string;
  title: string;
  type: "sprite" | "scene";
  date: string;
  color: string;
};

const mockProjects: Project[] = [
  { id: "8842", title: "Cyberpunk City", type: "scene", date: "2024-03-10", color: "bg-purple-500" },
  { id: "9120", title: "Hero Idle Animation", type: "sprite", date: "2024-03-09", color: "bg-blue-500" },
  { id: "7731", title: "Forest Tileset", type: "sprite", date: "2024-03-08", color: "bg-green-500" },
  { id: "6654", title: "Dungeon Level 1", type: "scene", date: "2024-03-05", color: "bg-orange-500" },
  { id: "5521", title: "NPC Merchant", type: "sprite", date: "2024-03-01", color: "bg-pink-500" },
  { id: "4419", title: "Space Background", type: "scene", date: "2024-02-28", color: "bg-cyan-500" },
];

const projectColors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500"];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentFilter, setCurrentFilter] = useState<"all" | "sprite" | "scene">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"sprite" | "scene">("sprite");
  const [newProjectName, setNewProjectName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = currentFilter === "all" || p.type === currentFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Math.floor(Math.random() * 9000 + 1000).toString(),
      title: newProjectName.trim(),
      type: selectedType,
      date: new Date().toISOString().split("T")[0],
      color: projectColors[Math.floor(Math.random() * projectColors.length)],
    };

    setProjects([newProject, ...projects]);
    setIsNewProjectOpen(false);
    setNewProjectName("");
    setSelectedType("sprite");
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Process imported files
    Array.from(files).forEach((file) => {
      const newProject: Project = {
        id: Math.floor(Math.random() * 9000 + 1000).toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: "sprite",
        date: new Date().toISOString().split("T")[0],
        color: projectColors[Math.floor(Math.random() * projectColors.length)],
      };
      setProjects((prev) => [newProject, ...prev]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-primary/15 bg-surface/50 backdrop-blur-md px-6 py-3 z-50">
        <div className="flex items-center justify-between gap-6">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Pixelar"
                width={100}
                height={32}
                priority
              />
            </div>
            <div className="h-5 w-[1px] bg-primary/20" />
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm font-semibold text-text">Projects</h2>
              <p className="text-xs text-text-muted">Manage your assets</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-highlight border border-primary/15">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-mono font-semibold text-text">450</span>
              </div>
              <div className="w-[1px] h-4 bg-primary/20" />
              <span className="text-xs text-text-muted">Credits</span>
            </div>

            <ProfileModal>
              <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-surface-highlight rounded-lg border border-primary/15 cursor-pointer hover:bg-surface-highlight/80 transition-colors">
                <div className="text-right">
                  <div className="text-xs font-medium text-text">Alex Design</div>
                  <div className="text-[10px] text-text-muted">Pro Plan</div>
                </div>
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary p-[0.5px]">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="User"
                    className="w-full h-full rounded-[3px] bg-black"
                  />
                </div>
              </div>
            </ProfileModal>

            <ProfileModal>
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary p-[1px] sm:hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                  className="w-full h-full rounded-[5px] bg-black"
                />
              </div>
            </ProfileModal>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Projects</h1>
            <p className="text-sm text-text-muted">Manage your game assets and scenes</p>
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

        {filteredProjects.length === 0 ? (
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
              className="group cursor-pointer border-dashed hover:border-primary hover:bg-primary/10 transition-all"
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
                <div className={`h-40 ${project.color} grid-pattern relative`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {project.type === "sprite" ? (
                      <ImageIcon className="w-12 h-12 text-white/80" />
                    ) : (
                      <Map className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(project.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium capitalize">
                      {project.type}
                    </span>
                    <span className="text-xs text-text-muted">#{project.id}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
            <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
