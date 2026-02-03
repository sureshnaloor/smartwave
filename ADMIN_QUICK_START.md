# Quick Start - Admin Pass Creation

## 🚀 Getting Started (Admin)

### 1. Access Admin Dashboard
```
URL: /admin/passes
Login: Use your admin credentials
```

### 2. Create Your First Pass

**Step 1: Click "Create Pass"**
- Button in top-right corner

**Step 2: Fill Basic Info**
- **Name**: e.g., "Community Yoga Session" (required)
- **Description**: Details about the pass
- **Type**: Event or Access
- **Category**: Choose from:
  - Community 👥
  - Temples ⛪
  - Spiritual 💗
  - Concerts 🎵
  - Workplace 💼
  - Events 🎉
  - Retail 🛍️
  - Access 🏢

**Step 3: Set Dates**
- Start Date & Time
- End Date & Time

**Step 4: Pin Location**
- Click on map to place marker
- Drag marker to adjust
- Address auto-fills from Google Maps
- Edit location name if needed
- Edit address if needed

**Step 5: Save**
- Click "Create Pass"
- Pass saved as draft
- Can activate later

## 📍 Location Features

### Interactive Map
- **Click**: Place marker
- **Drag**: Adjust position
- **Auto-fill**: Address from Google Maps
- **Manual Edit**: Override name/address

### What Gets Saved
```javascript
{
  name: "Central Park",           // Location name
  lat: 25.2048,                   // Latitude
  lng: 55.2708,                   // Longitude
  address: "Central Park, Dubai"  // Full address
}
```

## 🎯 Quick Actions

### View All Passes
```
/admin/passes
```

### Create New Pass
```
/admin/passes/create
```

### Review Join Requests
```
/admin/passes/memberships
```

## 📊 Pass Status

### Draft
- Not visible to users
- Can edit freely
- Activate when ready

### Active
- Visible to all users
- Users can join
- Appears in search/filters

## 👥 Membership Workflow

### User Requests
1. User finds your pass
2. Clicks "Request to Join"
3. Status: Pending

### You Review (Future)
- Currently SuperAdmin approves
- Soon: You can approve directly

### User Gets Access
1. Request approved
2. User can add to wallet
3. Pass appears in their collection

## 🗺️ Address Examples

### Auto-filled Address
```
"Sheikh Zayed Road, Dubai, United Arab Emirates"
"123 Main Street, Downtown, Dubai"
"Central Park, Al Wasl, Dubai"
```

### Manual Override
You can edit the auto-filled address:
- Fix typos
- Add building names
- Add floor/room numbers
- Add special instructions

## 📱 User Experience

### How Users See Your Pass

**In List:**
- Pass name
- Category badge
- Location name
- Date

**In Detail:**
- Full description
- Complete address
- Map view
- Join button

## ✅ Checklist

Before creating a pass:
- [ ] Have pass name ready
- [ ] Know the category
- [ ] Have location coordinates (or use map)
- [ ] Have start/end dates
- [ ] Have description written

After creating:
- [ ] Verify location is correct
- [ ] Check address is readable
- [ ] Review all details
- [ ] Activate when ready

## 🔍 Finding Your Passes

### Filter by Status
- **All**: See everything
- **Draft**: Work in progress
- **Active**: Live passes

### Quick Stats
- Total passes created
- Draft count
- Active count

## 🎨 Categories Guide

| Category | Best For |
|----------|----------|
| Community | Local gatherings, meetups |
| Temples | Religious events, visits |
| Spiritual | Meditation, retreats |
| Concerts | Music events |
| Workplace | Office access |
| Events | General events |
| Retail | Store access |
| Access | Building access |

## 🆘 Common Questions

### Q: Can users see draft passes?
**A:** No, only active passes are visible to users.

### Q: Can I edit a pass after creating?
**A:** Yes, click "Edit" on the pass card.

### Q: What if I don't have exact coordinates?
**A:** Just click on the map near the location, then drag the marker to the exact spot.

### Q: Can I create passes for other admins?
**A:** No, each admin creates their own passes.

### Q: Who approves join requests?
**A:** Currently SuperAdmin. Soon you'll be able to approve your own.

### Q: Can I delete a pass?
**A:** Edit functionality available. Delete coming soon.

## 📞 Quick Links

| Page | URL | Purpose |
|------|-----|---------|
| My Passes | `/admin/passes` | View all your passes |
| Create Pass | `/admin/passes/create` | Create new pass |
| Requests | `/admin/passes/memberships` | Review join requests |
| Dashboard | `/admin/dashboard` | Main admin page |

## 💡 Pro Tips

1. **Use Descriptive Names**: "Community Yoga - Sundays" vs "Yoga"
2. **Add Full Address**: Helps users find the location
3. **Set Accurate Dates**: Users filter by upcoming events
4. **Choose Right Category**: Helps users discover your pass
5. **Write Clear Descriptions**: Explain what the pass is for

## 🎯 Success Metrics

Track your passes:
- Total passes created
- Active vs draft
- User join requests
- Approved memberships

## 🔐 Security

- ✅ Only you can see your passes in admin
- ✅ Only you can edit your passes
- ✅ Users can only join, not edit
- ✅ SuperAdmin can approve requests

## 🚀 Next Steps

1. **Create your first pass**
2. **Activate it**
3. **Share with users**
4. **Review join requests**
5. **Approve members**

---

**Need Help?**
- Check ADMIN_PASS_CREATION.md for details
- See TESTING_GUIDE.md for testing steps
- Review ARCHITECTURE.md for system design

**Ready to Start?**
Go to `/admin/passes` and click "Create Pass"! 🎉
