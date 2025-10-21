import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import { IconButton } from "@mui/material";

const SocialIcon = ({ platform }) => {
  const iconData = {
    facebook: {
      icon: <FacebookIcon sx={{ color: "#1877F2", fontSize: 26 }} />,
    },
    google: {
      icon: <GoogleIcon sx={{ color: "#DB4437", fontSize: 26 }} />,
    },
    apple: {
      icon: <AppleIcon sx={{ color: "#000", fontSize: 26 }} />,
    },
  };

  const { icon } = iconData[platform];

  return (
    <IconButton
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 14px rgba(39, 174, 96, 0.25)",
          backgroundColor: "#fff",
        },
      }}
    >
      {icon}
    </IconButton>
  );
};

export default SocialIcon;
