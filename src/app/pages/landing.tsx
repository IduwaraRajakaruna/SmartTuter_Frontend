import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { PublicNav } from '@/app/components/public-nav';
import { FeatureCard } from '@/app/components/feature-card';
import { StatsSection } from '@/app/components/stats-section';
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
      <PublicNav />

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
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                bgColor={feature.bgColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection 
        stats={[
          { value: '500+', label: 'Active Students' },
          { value: '50+', label: 'Expert Teachers' },
          { value: '100+', label: 'Classes Available' }
        ]}
      />

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