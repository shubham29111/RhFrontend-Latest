import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.css']
})
export class BlogSectionComponent {
  public formattedContent: string[] | undefined;
  public blog: any;

  blogs: any[] = [
    {
      "id":'12',
      "publishedDate": "2024-08-01",
      "title": "Top 10 Tips for Booking the Best Hotel",
      "subtitle": "Learn how to find the best deals and book your perfect stay.",
      "tags": ["Travel Tips", "Hotel Booking", "Deals", "Savings"],
      "imageUrl": "https://cdn.prod.website-files.com/56e9debf633486e330198479/57b6723c0c7bdb62381c5e86_top-10-travel-bloggers-you-should-be-follow-danflyingsolo-danielclarke-lonelyplanet-skyscanner.jpg", // Replace with your actual image path
      "sectionTitle": "Booking Strategies",
      "quote": "Finding the right hotel doesn't have to be stressful.",
      "author": "Jane Doe",
      "content": "Whether you're traveling for business or leisure, booking the right hotel can make or break your trip. Here are the top strategies to ensure you get the best deal and the perfect accommodation for your needs:\n\n1. **Start Your Search Early:** Prices fluctuate, and starting your search early allows you to monitor rates and grab a good deal when you see one. Hotels often offer early bird discounts, especially during peak seasons.\n\n2. **Be Flexible with Dates:** If your travel dates are flexible, you can often save a significant amount by adjusting your stay to avoid peak days. Mid-week stays or off-season travel can offer better rates and less crowded accommodations.\n\n3. **Consider Location Carefully:** A hotel in a central location might cost more, but the convenience could save you time and transportation costs. Alternatively, staying a bit further out can offer better deals while still keeping you close to your points of interest.\n\n4. **Check for Hidden Fees:** Always read the fine print. Some hotels add resort fees, parking charges, and Wi-Fi costs that can significantly increase your bill. Make sure to factor these into your budget.\n\n5. **Use Comparison Websites:** Sites like Booking.com, Expedia, and Kayak allow you to compare prices across multiple booking platforms. Don’t forget to check the hotel’s direct website too – they sometimes offer exclusive deals or perks like free breakfast or late checkout.\n\n6. **Read Reviews and Ratings:** Look beyond the star ratings. Reading recent reviews on platforms like TripAdvisor can give you real insights into what to expect, such as room cleanliness, service quality, and the accuracy of the hotel's website photos.\n\n7. **Loyalty Programs and Discounts:** If you travel frequently, joining a hotel’s loyalty program can earn you points that lead to free nights or upgrades. Also, check for any discounts you may qualify for, such as AAA, AARP, or corporate rates.\n\n8. **Use Credit Card Perks:** Many credit cards offer points or cashback on travel purchases, and some even provide free travel insurance, room upgrades, or access to exclusive deals when you book through their portal.\n\n9. **Consider Alternative Accommodations:** Don’t limit yourself to traditional hotels. Depending on your destination, you might find better deals or more unique stays through platforms like Airbnb, Vrbo, or boutique hotels.\n\n10. **Contact the Hotel Directly:** Sometimes, calling the hotel directly can yield better rates or help you secure special requests. You can ask about upgrades, room preferences, or even negotiate a better rate, especially for longer stays."
    },  

    {
      "id":'13',
      "publishedDate": "2024-07-25",
      "title": "How to Choose a Family-Friendly Hotel",
      "subtitle": "Traveling with kids? Here’s how to pick the best hotel that caters to family needs.",
      "tags": ["Family Travel", "Hotel Booking", "Kids", "Family-Friendly"],
      "imageUrl": "https://media.istockphoto.com/id/1149219452/photo/female-blogger-writing-article-by-the-sea.webp?b=1&s=612x612&w=0&k=20&c=CHHP-1TKDe7fZjwVkat7IAn3pbBDPakHC6QJ7I5t_zQ=", // Replace with your actual image path
      "sectionTitle": "Family Travel Essentials",
      "quote": "Finding a hotel that suits everyone in the family can be a challenge, but it's worth the effort.",
      "author": "John Smith",
      "content": "Choosing the right hotel for a family vacation involves more than just finding a place to sleep. You'll want to consider amenities like play areas, pools, and spacious rooms. This guide will help you navigate through the options and make the best choice for your family."
    },
    {
      "id":'14',
      "publishedDate": "2024-07-20",
      "title": "Luxury Hotel Booking Guide",
      "subtitle": "Indulge in the finest hotels around the world with our comprehensive booking guide.",
      "tags": ["Luxury Travel", "Hotel Booking", "Premium", "Five-Star"],
      "imageUrl": "https://imgs.search.brave.com/ah-41A0LDgHkYGnNEoEDN5DE07ufMbjeNPaAokX6NKE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I2L0lt/YWdlX2NyZWF0ZWRf/d2l0aF9hX21vYmls/ZV9waG9uZS5wbmcv/NjQwcHgtSW1hZ2Vf/Y3JlYXRlZF93aXRo/X2FfbW9iaWxlX3Bo/b25lLnBuZw", // Replace with your actual image path
      "sectionTitle": "Luxury Travel Insights",
      "quote": "Luxury is in each detail.",
      "author": "Hubert de Givenchy",
      "content": "Luxury hotels offer more than just a place to stay—they provide an experience. From personalized service to exquisite dining, these hotels are designed to cater to your every need. Discover the top luxury hotels around the world and learn how to book them for your next getaway."
    },
    {
      "id":'15',
      "publishedDate": "2024-07-15",
      "title": "Budget Travel: Finding Affordable Hotels",
      "subtitle": "Discover how to book great hotels without breaking the bank.",
      "tags": ["Budget Travel", "Hotel Booking", "Affordable", "Savings"],
      "imageUrl": "https://plus.unsplash.com/premium_photo-1664472706956-42f42184f7a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHJhdmVsJTIwYmxvZ2dlcnxlbnwwfHwwfHx8MA%3D%3D", // Replace with your actual image path
      "sectionTitle": "Smart Savings",
      "quote": "Travel far, spend less.",
      "author": "Emily Thompson",
      "content": "Traveling on a budget doesn't mean you have to sacrifice comfort. With the right strategies, you can find affordable hotels that offer great value. This guide will show you how to find the best deals and make the most of your travel budget."
    },
    {
      "id":'16',
      "publishedDate": "2024-07-10",
      "title": "Top Destinations for Hotel Stays in 2024",
      "subtitle": "Explore the best cities for hotel stays in 2024, from urban escapes to serene retreats.",
      "tags": ["Travel Destinations", "Hotel Stays", "Top Cities", "2024 Travel"],
      "imageUrl": "https://images.unsplash.com/photo-1643258139516-6197a47dcd9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbCUyMGJsb2dnZXJ8ZW58MHx8MHx8fDA%3D", // Replace with your actual image path
      "sectionTitle": "Top Travel Picks",
      "quote": "The world is a book, and those who do not travel read only one page.",
      "author": "Saint Augustine",
      "content": "2024 is set to be an exciting year for travel, with many cities emerging as top destinations. Whether you're looking for a bustling urban experience or a peaceful retreat, there's a perfect destination waiting for you. Here's our pick of the top cities for hotel stays in 2024."
    },
      {
        "id":'17',
        "publishedDate": "2024-06-15",
        "title": "Luxury Hotels You Must Visit in 2024",
        "subtitle": "Indulge in the ultimate comfort and style at these luxurious hotels around the globe.",
        "tags": ["Luxury Hotels", "2024 Travel", "Top Hotels", "Luxury Stays"],
        "imageUrl": "https://images.unsplash.com/photo-1724497508928-14dd7894602c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMHx8fGVufDB8fHx8fA%3D%3D", // Replace with your actual image path
        "sectionTitle": "Unmatched Elegance",
        "quote": "Luxury must be comfortable, otherwise it is not luxury.",
        "author": "Coco Chanel",
        "content": "If you're planning a luxurious getaway in 2024, these hotels should be at the top of your list. From opulent interiors to world-class services, these establishments offer an unparalleled experience. Prepare to be pampered in some of the most extravagant hotels the world has to offer."
      },
      {
        "id":'18',
        "publishedDate": "2024-08-22",
        "title": "Budget-Friendly Hotels for Your 2024 Travels",
        "subtitle": "Discover affordable yet comfortable hotel options for your 2024 adventures.",
        "tags": ["Budget Travel", "Affordable Hotels", "2024 Travel", "Top Hotels"],
        "imageUrl": "https://plus.unsplash.com/premium_photo-1718400026904-84abfa334942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D", // Replace with your actual image path
        "sectionTitle": "Travel on a Budget",
        "quote": "Travel is the only thing you buy that makes you richer.",
        "author": "Anonymous",
        "content": "Traveling on a budget doesn't mean compromising on comfort. In 2024, you can find plenty of affordable hotels that offer great amenities and convenient locations. We've rounded up the best budget-friendly options that provide excellent value for your money, ensuring a comfortable stay without breaking the bank."
      }
    
    
    
  ];
  selectedBlogIndex = 0;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.selectedBlogIndex = this.blogs.findIndex(b => b.id === id) || 0;
      this.blog = this.blogs[this.selectedBlogIndex];
      this.loadBlog(this.blog);
    });
  }

 loadBlog(blog: any): void {
    this.formattedContent = blog.content
      .split(/\d+\.\s/)
      .filter(Boolean)
      .map((point: string, idx: number) => `${idx + 1}. ${point.trim()}`);

    this.scrollToTop(); 
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}