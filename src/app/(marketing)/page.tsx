import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Zap, MessageCircle, Bot } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Bot,
    title: 'AI 驱动的建议',
    description: '利用我们先进的 AI，为您的客服代理提供实时、准确的回复建议，提高解决问题的效率。',
  },
  {
    icon: MessageCircle,
    title: '实时聊天',
    description: '通过一个优雅、响应迅速的聊天小部件，与您的客户进行无缝沟通，提升用户体验。',
  },
  {
    icon: Zap,
    title: '轻松集成',
    description: '只需几行代码，即可将我们的聊天小部件轻松嵌入您的网站，无需复杂配置。',
  },
];

const pricingTiers = [
  {
    name: '入门版',
    price: '¥0',
    period: '月',
    description: '适合刚起步的个人和小型团队，体验核心功能。',
    features: [
      '1 个代理席位',
      '每月 50 次对话',
      '基础 AI 回复建议',
      '社区支持',
    ],
    cta: '开始免费使用',
    link: '/signup',
  },
  {
    name: '专业版',
    price: '¥199',
    period: '月',
    description: '适合成长中的企业，需要更强大的功能和支持。',
    features: [
      '最多 5 个代理席位',
      '每月 500 次对话',
      '高级 AI 回复建议',
      '基于历史案例的 AI 学习',
      '邮件支持',
    ],
    cta: '选择专业版',
    isFeatured: true,
    link: '/signup',
  },
  {
    name: '企业版',
    price: '联系我们',
    period: '',
    description: '为大型企业量身定制的解决方案，提供最高级别的支持和集成。',
    features: [
      '无限代理席位',
      '无限次对话',
      '专属 AI 模型训练',
      'API 访问权限',
      '专属客户经理',
    ],
    cta: '联系销售',
    link: '#',
  },
];

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-background to-blue-50/50 dark:to-blue-900/10 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline animate-fade-in-down">
            用 AI 重新定义客户支持
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up delay-200">
            霓虹客服 (Neon Support) 是一个智能、高效的实时客户支持平台。利用 AI 的力量，我们帮助您的团队更快地响应，更准确地解决问题。
          </p>
          <div className="space-x-4 animate-fade-in-up delay-400">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">免费开始</Button>
            </Link>
            <Link href="#features">
               <Button size="lg" variant="outline">了解更多</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">核心功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-headline">价格计划</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-xl mx-auto">选择最适合您业务需求的方案，立即开始提升您的客户服务水平。</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={`flex flex-col h-full ${tier.isFeatured ? 'border-primary shadow-primary/20 shadow-lg -translate-y-4' : 'shadow-md'}`}>
                {tier.isFeatured && (
                    <div className="bg-primary text-primary-foreground text-center text-sm font-semibold py-1 rounded-t-lg">最受欢迎</div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">/{tier.period}</span>}
                  </div>
                  <ul className="space-y-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
))}
                  </ul>
                </CardContent>
                <CardFooter>
                    <Link href={tier.link} className="w-full">
                        <Button className={`w-full ${tier.isFeatured ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-primary/80 hover:bg-primary/70 text-primary-foreground'}`}>
                            {tier.cta}
                        </Button>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
