import { MessageSquare, Gamepad2, Code, Palette, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const categories = [
  {
    id: 1,
    name: "General Discussion",
    icon: MessageSquare,
    posts: 1247,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Gaming",
    icon: Gamepad2,
    posts: 892,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    name: "Programming",
    icon: Code,
    posts: 2341,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    name: "Design",
    icon: Palette,
    posts: 567,
    color: "bg-pink-100 text-pink-700",
  },
];

const trendingTopics = [
  "React 19 Features",
  "Next.js App Router",
  "TypeScript Tips",
  "UI/UX Trends 2025",
  "JavaScript Performance",
];

export function ForumSidebar() {
  return (
    <aside className="w-64 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary">
                      {category.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.posts} posts
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
            >
              <span className="text-sm">{topic}</span>
              <Badge variant="secondary" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}