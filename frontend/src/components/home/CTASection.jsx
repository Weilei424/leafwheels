import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-20 bg-green-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-light text-white">
            Ready to Go Electric?
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've made the switch to
            sustainable transportation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/store"
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              Browse Vehicles
            </Link>
            <Link
              to="/contact"
              className="border border-green-400 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
