"use client";
import CommonLayout from "../components/layouts/CommonLayout";
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Grid, Paper, List, ListItem, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import Breadcrumb from "../components/ui/Breadcrumb";

const faqData = [
  {
    category: "Getting Started",
    icon: "🚀",
    questions: [
      {
        question: "How do I set up my restaurant profile?",
        answer: "Navigate to Settings > Profile and fill in your restaurant details including name, address, contact information, and operating hours."
      },
      {
        question: "How do I add my first menu items?",
        answer: "Go to Items > Catalog > Create to add new menu items. Include name, price, category, description, and an image for best results."
      },
      {
        question: "How do I configure payment methods?",
        answer: "Visit Payments > Methods to enable and configure available payment options like credit cards, digital wallets, and cash payments."
      }
    ]
  },
  {
    category: "Managing Items",
    icon: "🍽️",
    questions: [
      {
        question: "How do I create a new menu item?",
        answer: "1. Go to Items > Catalog > Create\n2. Fill in item details (name, price, category)\n3. Add description and image\n4. Set availability and special instructions\n5. Save the item"
      },
      {
        question: "How do I organize items into sections?",
        answer: "1. Go to Items > Sections\n2. Create sections like 'Appetizers', 'Main Courses', 'Desserts'\n3. Assign items to sections when creating or editing them\n4. Set display order for proper menu flow"
      },
      {
        question: "How do I update item prices?",
        answer: "1. Go to Items > Catalog\n2. Find the item you want to update\n3. Click 'Edit' and modify the price\n4. Save changes"
      }
    ]
  },
  {
    category: "Orders Management",
    icon: "📋",
    questions: [
      {
        question: "How do I view incoming orders?",
        answer: "Go to Orders > List to see all current and past orders. Orders are automatically sorted by status and time."
      },
      {
        question: "How do I update order status?",
        answer: "1. Open an order from Orders > List\n2. Use the status dropdown to change from 'Pending' to 'Preparing', 'Ready', or 'Completed'\n3. Add notes if needed"
      },
      {
        question: "How do I handle special requests?",
        answer: "Special instructions appear prominently in the order details. Review them carefully before preparing food and note any allergies or modifications."
      }
    ]
  },
  {
    category: "Customer Management",
    icon: "👥",
    questions: [
      {
        question: "How do I add a new customer?",
        answer: "1. Go to Customers > Add\n2. Fill in customer details (name, email, phone)\n3. Add address and any special notes\n4. Save the customer profile"
      },
      {
        question: "How do I view customer order history?",
        answer: "1. Go to Customers > List\n2. Click on a customer to view their profile\n3. See their order history and preferences"
      },
      {
        question: "How do loyalty programs work?",
        answer: "1. Go to Customers > Loyalty\n2. View existing programs or create new ones\n3. Set point requirements and benefits\n4. Points are automatically awarded based on purchases"
      }
    ]
  },
  {
    category: "Supplier Management",
    icon: "🏭",
    questions: [
      {
        question: "How do I add a new supplier?",
        answer: "1. Go to Suppliers > Add\n2. Enter supplier company details\n3. Add contact information and category\n4. Set up delivery schedules and terms"
      },
      {
        question: "How do I track supplier performance?",
        answer: "Visit Suppliers > Performance to view metrics like on-time delivery, quality scores, and reliability ratings for each supplier."
      },
      {
        question: "How do I manage supplier orders?",
        answer: "1. Go to Suppliers > List\n2. Select a supplier\n3. Create purchase orders for ingredients\n4. Track delivery status and quality"
      }
    ]
  },
  {
    category: "QR Code Management",
    icon: "📱",
    questions: [
      {
        question: "How do I generate QR codes for tables?",
        answer: "1. Go to QR > Generate\n2. Select 'Table' as QR type\n3. Enter table number\n4. Generate and download the QR code\n5. Print and place at tables"
      },
      {
        question: "How do I create QR codes for menus?",
        answer: "1. Go to QR > Generate\n2. Select 'Menu' as QR type\n3. Choose menu section or full menu\n4. Generate QR code\n5. Customers can scan to view digital menu"
      },
      {
        question: "How do I manage existing QR codes?",
        answer: "Go to QR > Tables to view all generated QR codes. You can edit descriptions, regenerate, or deactivate codes as needed."
      }
    ]
  },
  {
    category: "Payment Processing",
    icon: "💳",
    questions: [
      {
        question: "How do I view payment history?",
        answer: "Go to Payments > History to see all transactions, including amounts, methods, and dates."
      },
      {
        question: "How do I configure payment methods?",
        answer: "1. Go to Payments > Methods\n2. Enable/disable payment options\n3. Configure settings for each method\n4. Set up integration with payment processors"
      },
      {
        question: "How do I handle refunds?",
        answer: "1. Go to Payments > History\n2. Find the transaction\n3. Click 'Refund' and enter amount\n4. Process through your payment provider"
      }
    ]
  },
  {
    category: "Inventory Management",
    icon: "📦",
    questions: [
      {
        question: "How do I add inventory items?",
        answer: "1. Go to Inventory > Add\n2. Enter item details (name, category, unit)\n3. Set minimum stock levels\n4. Add current quantity"
      },
      {
        question: "How do I track stock levels?",
        answer: "Go to Inventory > List to view current stock levels, low stock alerts, and usage trends."
      },
      {
        question: "How do I perform stock adjustments?",
        answer: "1. Go to Inventory > Adjust\n2. Select item to adjust\n3. Choose adjustment type (addition, subtraction, correction)\n4. Enter quantity and reason\n5. Save changes"
      }
    ]
  },
  {
    category: "Security & Settings",
    icon: "🔒",
    questions: [
      {
        question: "How do I change my password?",
        answer: "Go to Security > Password and enter your current password, then set a new secure password."
      },
      {
        question: "How do I manage user roles?",
        answer: "Go to Security > Users to add staff members and assign roles like Manager, Chef, or Server with appropriate permissions."
      },
      {
        question: "How do I update restaurant settings?",
        answer: "Visit Settings > General to update restaurant information, operating hours, and system preferences."
      }
    ]
  }
];

export default function HelpPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Help" },
          ]}
        />

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <HelpIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Help & Support Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find answers to common questions and learn how to use all features of your restaurant management system
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {faqData.map((category) => (
            <Grid size={{ xs: 12, md: 6 }} key={category.category}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: 8 }}>{category.icon}</span>
                  {category.category}
                </Typography>
                {category.questions.map((faq, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Paper sx={{ p: 3, bgcolor: "primary.light", color: "primary.contrastText" }}>
            <Typography variant="h6" gutterBottom>
              Still need help?
            </Typography>
            <Typography variant="body2">
              Contact our support team at support@restaurantapp.com or call 1-800-RESTAURANT
            </Typography>
          </Paper>
        </Box>
      </Box>
    </CommonLayout>
  );
}
