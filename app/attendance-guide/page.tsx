"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Hash,
  CheckCircle,
  Users,
  Clock,
  MapPin,
  ArrowRight,
  Copy,
  Share2,
  AlertCircle,
  Info,
  Star,
  Heart,
  Zap,
  Shield,
  UserCheck,
  Calendar,
  Bell,
  Eye,
  HelpCircle,
  ExternalLink,
  Smartphone,
  Monitor,
  Mail,
} from "lucide-react";

export default function AttendanceGuidePage() {
  const steps = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Register for an Event",
      description: "Sign up for any event through the events page",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Receive Your Code",
      description:
        "Get your unique 8-character attendance code via email and notifications",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Hash className="w-8 h-8" />,
      title: "Save Your Code",
      description: "Access all your codes anytime in 'My Attendance Codes'",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Check In at Event",
      description: "Present your code to event staff or use self check-in",
      color: "from-orange-500 to-red-500",
    },
  ];

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Friendly",
      description: "Access your codes anywhere on any device",
    },
    {
      icon: <Copy className="w-6 h-6" />,
      title: "Easy Sharing",
      description: "Copy or share codes with a single click",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure",
      description: "Unique codes prevent unauthorized access",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Notifications",
      description: "Get notified about check-in status updates",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Real-time Status",
      description: "See check-in status updates instantly",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Tracking",
      description: "Automatic timestamp recording for attendance",
    },
  ];

  const faqs = [
    {
      question: "What if I lose my attendance code?",
      answer:
        "No worries! You can always find all your codes in the 'My Attendance Codes' page. They're also sent to your email when you register.",
    },
    {
      question: "Can I share my attendance code with someone else?",
      answer:
        "Attendance codes are personal and tied to your registration. Sharing codes may result in attendance tracking issues.",
    },
    {
      question: "What if the QR code doesn't work?",
      answer:
        "If there are any technical issues, you can always use the manual code entry option or ask event staff for assistance.",
    },
    {
      question: "How long are attendance codes valid?",
      answer:
        "Codes are valid for the entire duration of the event and don't expire unless the event is cancelled.",
    },
    {
      question: "Can I check in multiple times?",
      answer:
        "Typically, you only need to check in once per event. However, some events may have multiple sessions requiring separate check-ins.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Attendance Code Guide
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Everything you need to know about using attendance codes for
            seamless event check-ins. Simple, secure, and efficient.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-blue-200 text-lg">
              Get checked in to events in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4 text-white`}
                  >
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-blue-200 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sample Code Display */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Sample Attendance Code
            </h2>
            <p className="text-blue-200 text-lg">
              This is what your attendance code looks like
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <Hash className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-mono font-bold text-white mb-2">
                  ABC12DEF
                </div>
                <p className="text-blue-200 text-sm">8-Character Unique Code</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Unique to your registration</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Case-insensitive</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Valid for entire event</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-blue-200 text-lg">
              Designed for convenience and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Check-in Methods
            </h2>
            <p className="text-blue-200 text-lg">
              Multiple ways to use your attendance code
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                QR Code Scanning
              </h3>
              <p className="text-blue-200 mb-4">
                Event staff can quickly scan your QR code for instant check-in.
                Fast and contactless.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-300">
                  <Zap className="w-4 h-4" />
                  <span>Instant recognition</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <Shield className="w-4 h-4" />
                  <span>Contactless process</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <Star className="w-4 h-4" />
                  <span>Preferred method</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Manual Code Entry
              </h3>
              <p className="text-blue-200 mb-4">
                Simply provide your 8-character code to event staff for manual
                entry and verification.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-blue-300">
                  <Users className="w-4 h-4" />
                  <span>Staff assistance available</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                  <Monitor className="w-4 h-4" />
                  <span>Backup option</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                  <Heart className="w-4 h-4" />
                  <span>Always reliable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-blue-200 text-lg">
              Got questions? We've got answers!
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Pro Tips for Event Check-in
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Save codes to your phone's notes app</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>
                        Arrive a few minutes early for smooth check-in
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Keep your phone charged for code access</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Screenshot your code as backup</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Ask staff if you need any assistance</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Check your email for code confirmations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              View your attendance codes, register for upcoming events, or
              browse our event calendar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = "/my-attendance-codes")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Hash className="w-4 h-4 mr-2" />
                View My Codes
              </Button>
              <Button
                onClick={() => (window.location.href = "/etkinlikler")}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
