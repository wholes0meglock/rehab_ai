import React, { useState } from 'react';
import { Upload, Calendar, Brain, CheckCircle, AlertCircle, FileText, Image } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('landing'); // 'landing' or 'upload'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    surgeryDate: '',
    conditions: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert('Please upload a file first!');
      return;
    }

    console.log('🔄 Generating plan...');

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('patient_info', JSON.stringify(patientInfo));
    formData.append('additional_notes', additionalNotes);
    
    try {
      const response = await fetch('http://localhost:8000/generate-plan', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ SUCCESS! Plan:', result.plan);
        console.log('📋 Schedule:', result.plan.schedule);
        alert('🎉 Plan generated! Check browser console (F12) to see the full plan.');
      } else {
        console.error('❌ Error:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Connection failed:', error);
      alert('Cannot connect to backend. Make sure it is running on http://localhost:8000');
    }
  };

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Rehabilitation
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Personal<br />Rehab Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Upload your discharge summary and let AI create a personalized, 
              day-by-day rehabilitation plan that fits your schedule.
            </p>
            <button
              onClick={() => setStep('upload')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Get Started →
            </button>
          </div>

          {/* How It Works */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload Summary</h3>
              <p className="text-gray-600">
                Upload your surgical discharge summary as PDF or image. Our AI extracts all the details.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI understands your surgery, finds the right protocol, and personalizes it for you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Daily Schedule</h3>
              <p className="text-gray-600">
                Get a complete 2-week plan with exercises, instructions, and reminders—scheduled around your life.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose RehabAI?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Evidence-based rehab protocols from medical literature',
                'Personalized to your surgery type and recovery phase',
                'Step-by-step exercise instructions with safety tips',
                'Fits into YOUR schedule, not a generic template',
                'Track progress and stay accountable',
                'Always know what to do next'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong className="block mb-1">Medical Disclaimer</strong>
              RehabAI is a scheduling and educational tool. Always consult your surgeon and physical therapist 
              before starting any exercise program. This is not a replacement for professional medical advice.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Upload Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => setStep('landing')}
          className="text-gray-600 hover:text-gray-900 mb-8 flex items-center gap-2"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Create Your Rehab Plan</h1>
          <p className="text-gray-600">Upload your discharge summary and provide some basic information</p>
        </div>

        {/* Main Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-600" />
            Discharge Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Document (PDF or Image)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploadedFile ? (
                    <div>
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="max-h-48 mx-auto mb-4 rounded-lg" />
                      ) : (
                        <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      )}
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Notes (Optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="E.g., 'Doctor mentioned focusing on extension' or 'I have pain in specific movements' or any other details..."
                className="w-full h-[280px] px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Patient Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                placeholder="32"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Date</label>
              <input
                type="date"
                value={patientInfo.surgeryDate}
                onChange={(e) => setPatientInfo({...patientInfo, surgeryDate: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions (Optional)
              </label>
              <input
                type="text"
                value={patientInfo.conditions}
                onChange={(e) => setPatientInfo({...patientInfo, conditions: e.target.value})}
                placeholder="E.g., Diabetes, Hypertension"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-3">Your Available Time Slots</h2>
          <p className="text-gray-600 mb-6 text-sm">When can you do rehab exercises?</p>
          
          <div className="space-y-3">
            {[
              'Weekday Mornings (7-9 AM)',
              'Weekday Evenings (6-8 PM)',
              'Weekend Mornings (9-11 AM)',
              'Lunch Break (12-1 PM)'
            ].map((slot, i) => (
              <label key={i} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                <span className="text-gray-700">{slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!uploadedFile}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Generate My Rehab Plan →
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Processing takes about 10-15 seconds
        </p>
      </div>
    </div>
  );
}