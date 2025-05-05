
import React from "react";
import { Link } from "react-router-dom";

interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  linkTo: string;
  imagePosition?: "left" | "right";
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  imageSrc,
  linkTo,
  imagePosition = "left",
}) => {
  const isImageLeft = imagePosition === "left";

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-stretch">
          {/* Image */}
          <div className={`md:w-1/2 ${isImageLeft ? "md:order-1" : "md:order-2"}`}>
            <div className="feature-card h-full">
              <img
                src={imageSrc}
                alt={title}
                className="h-full w-full object-cover"
              />
              <div className="feature-overlay">
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <Link to={linkTo} className="btn-learn-more">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`md:w-1/2 ${isImageLeft ? "md:order-2" : "md:order-1"}`}>
            <div className="flex h-full flex-col justify-center">
              <h2 className="mb-4 text-3xl font-bold text-textile-900">{title}</h2>
              <p className="mb-6 text-lg text-textile-600">{description}</p>
              <Link
                to={linkTo}
                className="inline-flex w-fit items-center rounded-md bg-textile-900 px-4 py-2 text-white transition-colors hover:bg-textile-800"
              >
                Explore {title}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
