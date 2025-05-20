import React from "react";
import { Card, CardProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(17, 17, 17, 0.8)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(20px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0, 0, 0, 0.5)"
      : "0 10px 30px rgba(16, 185, 129, 0.1)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(107, 114, 128, 0.3)"
      : "rgba(16, 185, 129, 0.15)"
  }`,
  borderRadius: 16,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 40px rgba(0, 0, 0, 0.7)"
        : "0 20px 40px rgba(16, 185, 129, 0.2)",
  },
}));

export const GlassCard: React.FC<CardProps> = (props) => {
  return <StyledCard {...props} />;
};

export default GlassCard;
