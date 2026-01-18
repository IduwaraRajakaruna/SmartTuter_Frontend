import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { GraduationCap, BookOpen, Users, Video, Star, Award } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Wide Range of Subjects',
      description: 'From Mathematics to Literature, find expert tutors for every subject',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Video,
      title: 'Live Online Classes',
      description: 'Interactive Zoom sessions with experienced educators',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Users,
      title: 'Small Class Sizes',
      description: 'Personalized attention with limited students per class',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Star,
      title: 'Highly Rated Teachers',
      description: 'Learn from verified and top-rated educators',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Award,
      title: 'Quality Materials',
      description: 'Access comprehensive study resources and materials',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-2xl">TuitionHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/classes">
              <Button variant="ghost">Browse Classes</Button>
            </Link>
            <Link to="/teachers">
              <Button variant="ghost">Our Teachers</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with expert tutors, access quality education, and achieve your academic goals with our comprehensive online tuition platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Users className="w-5 h-5" />
                  Register as Student
                </Button>
              </Link>
              <Link to="/register?role=teacher">
                <Button size="lg" variant="outline" className="gap-2 border-2 border-purple-200 hover:bg-purple-50">
                  <Award className="w-5 h-5" />
                  Become a Teacher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Why Choose TuitionHub?</h2>
            <p className="text-muted-foreground">
              Everything you need for a successful online learning experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1 border-none shadow-md">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <h3 className="text-4xl mb-2">500+</h3>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div>
              <h3 className="text-4xl mb-2">50+</h3>
              <p className="text-muted-foreground">Expert Teachers</p>
            </div>
            <div>
              <h3 className="text-4xl mb-2">100+</h3>
              <p className="text-muted-foreground">Classes Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students already learning with TuitionHub
            </p>
            <Link to="/register">
              <Button size="lg">Sign Up Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 TuitionHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}