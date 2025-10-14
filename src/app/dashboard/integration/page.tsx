'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function IntegrationPage() {
    const { toast } = useToast();
    const codeSnippet = `<div id="neonsupport-widget-container"></div>
<script 
  src="https://your-app-domain.com/widget.js" 
  data-widget-id="YOUR_UNIQUE_WIDGET_ID" 
  defer>
</script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSnippet);
        toast({
            title: "已复制到剪贴板！",
            description: "您现在可以将代码粘贴到您网站的HTML中。",
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">网站整合</CardTitle>
                    <CardDescription>
                        通过将此代码片段粘贴到HTML文件的<code>&lt;/body&gt;</code>结束标签之前，将霓虹客服聊天小部件嵌入到您的网站中。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative rounded-md bg-muted/50 p-4 font-mono text-sm">
                        <pre><code>{codeSnippet}</code></pre>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-muted"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">复制代码</span>
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        请记住将<code>YOUR_UNIQUE_WIDGET_ID</code>替换为您在设置页面中的实际小部件ID。
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
