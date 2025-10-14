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
            title: "Copied to clipboard!",
            description: "You can now paste the code into your website's HTML.",
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Website Integration</CardTitle>
                    <CardDescription>
                        Embed the NeonSupport chat widget on your website by pasting this code snippet just before the closing 
                        <code>&lt;/body&gt;</code> tag of your HTML file.
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
                            <span className="sr-only">Copy code</span>
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Remember to replace <code>YOUR_UNIQUE_WIDGET_ID</code> with your actual widget ID from the settings page.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
