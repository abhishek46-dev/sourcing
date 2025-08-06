const app = require('./app');
const AssortmentPlan = require('./models/AssortmentPlan');
const Techpack = require('./models/Techpack');
const path = require('path');
const Pantone = require('./models/Pantone');
const Vendor = require('./models/Vendor');
const BestSellingStyle = require('./models/BestSellingStyle');
const { ObjectId, GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const PrintStrike = require('./models/PrintStrike');
const PreProduction = require('./models/PreProduction');
const FPTReport = require('./models/FPTReport');
const GPTReport = require('./models/GPTReport');
const PantoneLibrary = require('./models/PantoneLibrary');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

// Get all assortment plans
app.get('/api/assortment-plans', async (req, res) => {
  try {
    const plans = await AssortmentPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single assortment plan by id
app.get('/api/assortment-plans/:id', async (req, res) => {
  try {
    const plan = await AssortmentPlan.findOne({ id: req.params.id });
    if (!plan) return res.status(404).json({ error: 'Not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all accepted techpacks
app.get('/api/tech--packs', async (req, res) => {
  try {
    const techpacks = await Techpack.find({ status: 'ACCEPTED' });
    res.json(techpacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch techpacks' });
  }
});

// Get all accepted techpacks for a brand manager
app.get('/api/tech--packs/brand/:brandManager', async (req, res) => {
  try {
    const techpacks = await Techpack.find({ status: 'ACCEPTED', brandManager: req.params.brandManager });
    res.json(techpacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch techpacks' });
  }
});

// Serve PDF for preview (stub, adjust path as needed)
app.get('/api/tech--packs/pdf/:id', async (req, res) => {
  try {
    const techpack = await Techpack.findById(req.params.id);
    if (!techpack || !techpack.pdfPath) return res.status(404).send('PDF not found');
    res.sendFile(path.resolve(techpack.pdfPath));
  } catch (err) {
    res.status(500).send('Failed to fetch PDF');
  }
});

// Send to vendor (stub)
app.post('/api/tech--packs/send-to-vendor', async (req, res) => {
  // req.body: { techpackIds: [], vendorId: ... }
  // Implement your logic here
  res.json({ success: true });
});

// Helper to get base64 image
function getBase64Image(imageField) {
  if (!imageField) return null;
  if (imageField.startsWith('data:image')) return imageField; // already data URL
  // If it's a base64 string without prefix, add a default prefix
  if (/^[A-Za-z0-9+/=]+={0,2}$/.test(imageField.trim())) {
    return `data:image/jpeg;base64,${imageField.trim()}`;
  }
  // If it's a file path, read and convert
  const imgPath = path.join(__dirname, 'public', 'images', imageField);
  try {
    const imgData = fs.readFileSync(imgPath);
    const ext = path.extname(imgPath).slice(1) || 'png';
    return `data:image/${ext};base64,${imgData.toString('base64')}`;
  } catch {
    return null;
  }
}

// Get all Pantone records
app.get('/api/pantone', async (req, res) => {
  try {
    const docs = await Pantone.find();
    const withImages = docs.map(doc => {
      const obj = doc.toObject();
      obj.image = getBase64Image(obj.image);
      return obj;
    });
    res.json(withImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single Pantone by id
app.get('/api/pantone/:id', async (req, res) => {
  try {
    const pantone = await Pantone.findById(req.params.id);
    if (!pantone) return res.status(404).json({ error: 'Not found' });
    const obj = pantone.toObject();
    obj.image = getBase64Image(obj.image);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Pantones for a sourcing manager
app.get('/api/pantone/manager/:manager', async (req, res) => {
  try {
    const pantones = await Pantone.find({ manager: req.params.manager });
    const withImages = pantones.map(doc => {
      const obj = doc.toObject();
      obj.image = getBase64Image(obj.image);
      return obj;
    });
    res.json(withImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor endpoints
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    const vendor = new Vendor({ name, mobile, email });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/vendors', async (req, res) => {
  try {
    const { ids } = req.body; // expects { ids: [id1, id2, ...] }
    await Vendor.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User endpoint (as in users.js)
app.get('/api/users', function(req, res) {
  res.send('respond with a resource');
});

// Get all best selling styles
app.get('/api/best-selling-styles', async (req, res) => {
  try {
    const styles = await BestSellingStyle.find();
    res.json(styles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test error logging route
app.get('/api/test-error', (req, res) => {
  try {
    throw new Error('This is a test error!');
  } catch (err) {
    console.error('Test Error:', err.stack || err);
    res.status(500).json({ error: err.message });
  }
});

let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

app.get('/api/file/:id', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const fileId = new ObjectId(req.params.id);
    gfsBucket.openDownloadStream(fileId)
      .on('error', () => res.status(404).send('File not found'))
      .pipe(res);
  } catch {
    res.status(400).send('Invalid file id');
  }
});

const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

app.patch('/api/best-selling-styles/:id/final-order', async (req, res) => {
  try {
    const updateFields = req.body;
    const id = req.params.id;
    const query = isValidObjectId(id) ? { _id: mongoose.Types.ObjectId(id) } : { _id: id };
    const updated = await BestSellingStyle.findOneAndUpdate(
      query,
      updateFields,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all PrintStrike records
// Get all PrintStrike records (with base64 image if present)
app.get('/api/printstrike', async (req, res) => {
  try {
    const docs = await PrintStrike.find();
    // If 'image' is present and not a data URL, add prefix
    const withImages = docs.map(doc => {
      const obj = doc.toObject();
      if (obj.image && !obj.image.startsWith('data:image')) {
        obj.image = `data:image/jpeg;base64,${obj.image}`;
      }
      return obj;
    });
    res.json(withImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single PrintStrike by id
app.get('/api/printstrike/:id', async (req, res) => {
  try {
    const doc = await PrintStrike.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all PreProduction records
// Get all PreProduction records (with base64 image if present)
app.get('/api/preproduction', async (req, res) => {
  try {
    const docs = await PreProduction.find();
    // If 'image' is present and not a data URL, add prefix
    const withImages = docs.map(doc => {
      const obj = doc.toObject();
      if (obj.image && !obj.image.startsWith('data:image')) {
        obj.image = `data:image/jpeg;base64,${obj.image}`;
      }
      return obj;
    });
    res.json(withImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single PreProduction by id
app.get('/api/preproduction/:id', async (req, res) => {
  try {
    const doc = await PreProduction.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all FPT reports
app.get('/api/fptreports', async (req, res) => {
  try {
    const reports = await FPTReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single FPT report by id
app.get('/api/fptreports/:id', async (req, res) => {
  try {
    const report = await FPTReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all GPT reports
app.get('/api/gptreports', async (req, res) => {
  try {
    const reports = await GPTReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single GPT report by id
app.get('/api/gptreports/:id', async (req, res) => {
  try {
    const report = await GPTReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all PantoneLibrary records
app.get('/api/pantone-libraries', async (req, res) => {
  try {
    const libraries = await PantoneLibrary.find();
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 