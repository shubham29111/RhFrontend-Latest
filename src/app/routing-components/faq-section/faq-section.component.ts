import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.css']
})
export class FaqSectionComponent {

  faqs = [
    {
      question: 'What do I need to book a room?',
      answer: 'To book a room, you need a valid ID, a payment method, and contact information.'
    },
    {
      question: 'How can I confirm my reservation?',
      answer: 'You can confirm your reservation by checking the confirmation email sent to you after booking.'
    },
    {
      question: 'How can I change my reservation?',
      answer: 'To change your reservation, log in to your account or contact our support team.'
    },
    {
      question: 'How do I know whether or not my booking has been cancelled?',
      answer: 'You will receive a cancellation confirmation email. If you haven’t received it, please contact our support team.'
    },
    {
      question: 'In which currency do I pay for the booking? What exchange rate is used for payments?',
      answer: 'You will be charged in the local currency of the hotel. The exchange rate is determined by your credit card provider or bank.'
    },
    {
      question: 'I need a reservation payment confirmation. How do I get it?',
      answer: 'You can get a payment confirmation by logging into your account and checking the booking details.'
    },
    {
      question: 'What documents do I need to check in?',
      answer: 'You need a valid ID and the reservation confirmation at check-in.'
    },
    {
      question: 'How do I make a booking for a group of people?',
      answer: 'To make a group booking, please contact our support team for assistance with group rates and special offers.'
    },
    {
      question: 'Does the room price include any meals?',
      answer: 'Some room prices include meals, while others do not. Please check the booking details for more information.'
    },
    {
      question: 'Are the room prices shown per guest or per room?',
      answer: 'The room prices are typically shown per room, not per guest, unless specified otherwise.'
    }
  ];

  // Popup visibility and selected FAQ
  popupVisible = false;
  selectedFaq: any = null;

  // Store the selected feedback emoji
  selectedFeedback: string | null = null;

  // Method to open the popup with the selected FAQ
  openPopup(faq: any) {
    this.selectedFaq = faq;
    this.popupVisible = true;
    this.selectedFeedback = null; // Reset the feedback selection on popup open
  }

  // Method to close the popup
  closePopup() {
    this.popupVisible = false;
    this.selectedFaq = null;
  }

  // Method to handle feedback selection
  sendFeedback(feedbackType: string) {
    this.selectedFeedback = feedbackType;
    console.log(`User feedback: ${feedbackType}`);
    // Here you can add logic to send this feedback to a backend server or handle it otherwise
  }
}
