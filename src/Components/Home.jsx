import React from 'react';
import { Play, Zap, Target, TrendingUp, ArrowRight, Sparkles, Star, Quote, Users, Award, CheckCircle, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';


const Hero = ({ onSectionChange }) => {
  const features = [
    {
      icon: Play,
      title: 'AI Video Interviews',
      description: 'Practice with realistic AI-powered interview simulations'
    },
    {
      icon: Zap,
      title: 'Smart Testing',
      description: 'Adaptive tests that adjust to your skill level'
    },
    {
      icon: Target,
      title: 'Resume Analysis',
      description: 'Get AI-powered feedback on your resume'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Track your progress with detailed analytics'
    }
  ];

  const companyLogos = [
    { name: 'Google', logo: 'Images/Google Logo.png' },
    { name: 'Microsoft', logo: 'https://eodhd.com/img/logos/US/MSFT.png' },
    { name: 'Amazon', logo: 'Images/Amazon Logo.png' },
    { name: 'Meta', logo: 'Images/Meta Logo.png' },
    { name: 'Apple', logo: 'Images/Apple Logo.png' },
    { name: 'Netflix', logo: 'Images/Netflix Logo.png' },
    // { name: 'Tesla', logo: 'Images/Tesla Logo.png' },
    // { name: 'Spotify', logo: 'Images/Spotify Logo.png' },
    // { name: 'Netflix', logo: 'Images/Netflix Logo.png' },
    // { name: 'Tesla', logo: 'Images/Tesla Logo.png' },
    // { name: 'Spotify', logo: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=100&h=60' }

  ];

  const services = [
    {
      icon: Play,
      title: 'AI Video Interviews',
      description: 'Experience realistic interview scenarios with our advanced AI interviewer that adapts to your responses and provides personalized feedback.',
      features: ['Real-time conversation', 'Behavioral & technical questions', 'Performance analytics', 'Industry-specific scenarios']
    },
    {
      icon: Target,
      title: 'Smart Written Tests',
      description: 'Take adaptive assessments that adjust difficulty based on your performance, covering technical skills, aptitude, and domain knowledge.',
      features: ['Adaptive difficulty', 'Instant feedback', 'Progress tracking', 'Industry benchmarks']
    },
    {
      icon: TrendingUp,
      title: 'Resume Analysis',
      description: 'Get comprehensive AI-powered analysis of your resume with actionable insights to improve your chances of landing interviews.',
      features: ['ATS optimization', 'Keyword analysis', 'Format suggestions', 'Industry alignment']
    },
    {
      icon: Users,
      title: 'Personal Coaching',
      description: 'Receive one-on-one guidance from our AI coach, tailored to your career goals and interview preparation needs.',
      features: ['Personalized tips', '24/7 availability', 'Progress monitoring', 'Goal setting']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'InterviewAI helped me land my dream job at Google. The AI interviewer was incredibly realistic and helped me practice behavioral questions I never would have thought of.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Microsoft',
      image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'The resume analysis feature was a game-changer. It identified gaps I didn\'t even know existed and helped me optimize for ATS systems.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Amazon',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'The personalized study plans kept me focused and motivated. I improved my interview performance by 40% in just 3 weeks.',
      rating: 5
    },
    {
      name: 'David Park',
      role: 'Engineering Manager at Meta',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'As someone transitioning to management, the leadership-focused interviews were exactly what I needed. Highly recommend!',
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const heading1Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const heading2Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, delay: 0.1, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={badgeVariants}
            className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-blue-600" />
            </motion.div>
            <span className="text-sm font-medium text-gray-700">Powered by Advanced AI</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heading1Variants}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Master Your
              </span>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heading2Variants}
              className="text-5xl md:text-7xl font-bold text-gray-900"
            >
              Interview Skills
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Prepare for your dream job with AI-powered interview practice,
              personalized coaching, and comprehensive skill assessments.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              onClick={() => onSectionChange('video-interview')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Interview Practice</span>
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              onClick={() => onSectionChange('dashboard')}
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              View Dashboard
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
          >
            {[
              { number: '50K+', label: 'Students Trained' },
              { number: '95%', label: 'Success Rate' },
              { number: '1000+', label: 'Interview Questions' },
              { number: '24/7', label: 'AI Support' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center cursor-pointer"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Company Logos Banner */}
      <div className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Land your next dream job
            </h2>
            <p className="text-gray-600">Join thousands of students who landed jobs at top companies</p>
          </motion.div>

          <div className="relative overflow-x-hidden">
            <div className="flex animate-scroll space-x-12 items-center w-max hover:[--scroll-time:40s] !overflow-y-visible"
                 >
              {[...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos].map((company, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer object-contain"
                >
                  
                  {/* <span className="text-gray-700 font-semibold text-sm">{company.name}</span> */}
                  <img src={company.logo} alt={company.name} className="w-24 h-16 object-contain text-gray-700 font-semibold" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 mt-6">
            Everything You Need to <span className="text-blue-600">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive interview preparation tools
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 10, scale: 1.2 }}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* What We Do Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How We Help You <span className="text-blue-600">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with proven interview preparation methods
            </p>
          </motion.div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex items-center gap-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: featureIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                    <div className="aspect-video bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <service.icon className="h-16 w-16 text-blue-600 opacity-50" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-blue-600">Students Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have successfully landed their dream jobs
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-600 opacity-50 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center space-x-3">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    InterviewAI
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering professionals worldwide with AI-powered interview preparation tools and personalized coaching.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Product */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {['Video Interviews', 'Written Tests', 'Resume Analysis', 'AI Coaching', 'Study Plans', 'Dashboard'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Press', 'Blog', 'Partners', 'Contact'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3 mb-6">
                {['Help Center', 'Documentation', 'API Reference', 'Status', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </motion.li>
                ))}
              </ul>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>support@interviewai.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 InterviewAI. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
