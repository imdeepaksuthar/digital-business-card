import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Section } from './Section';
import { ImageUpload } from './ImageUpload';
import { DynamicList } from './DynamicList';
import { Save, ArrowLeft } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { Modal } from '../ui/Modal';

interface CardEditorProps {
    initialData?: any;
    isEditing?: boolean;
    userData?: any;
}

export default function CardEditor({ initialData, isEditing = false, userData }: CardEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Core Card Data
    const [formData, setFormData] = useState({
        business_name: '',
        slug: '',
        tagline: '',
        sub_header: '',
        description: '',
        founded_at: '',
        category: '',
        sub_category: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        map_url: '',
        latitude: '',
        longitude: '',
        theme_color: '#3b82f6',
        bank_details: {
            bank_name: '',
            account_holder_name: '',
            account_number: '',
            ifsc_code: ''
        },
        payment_qr_code: '',
        ...initialData
    });

    useEffect(() => {
        if (!isEditing && userData && !formData.email) {
            setFormData((prev: any) => ({
                ...prev,
                business_name: userData.name || '',
                email: userData.email || ''
            }));
        }
    }, [userData, isEditing]);

    // Ensure date format is YYYY-MM-DD for input type="date"
    useEffect(() => {
        if (initialData?.founded_at) {
            const date = new Date(initialData.founded_at);
            const formattedDate = date.toISOString().split('T')[0];
            setFormData((prev: any) => ({ ...prev, founded_at: formattedDate }));
        }
    }, [initialData]);

    // Bank QR File
    const [paymentQrFile, setPaymentQrFile] = useState<File | null>(null);

    // Sub-resources
    const [socialLinks, setSocialLinks] = useState<any[]>(initialData?.social_links || []);
    const [products, setProducts] = useState<any[]>(initialData?.products || []);
    const [proprietors, setProprietors] = useState<any[]>(initialData?.proprietors || []);

    // Dropdown States
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');

    // Social Platform State
    const [socialPlatforms, setSocialPlatforms] = useState<any[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [socialUsername, setSocialUsername] = useState<string>('');

    // Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
    const [productFormData, setProductFormData] = useState({
        name: '',
        price: '',
        description: '',
        link: '',
        image: '',
        imageFile: null as File | null
    });

    // Proprietor Modal State
    const [isProprietorModalOpen, setIsProprietorModalOpen] = useState(false);
    const [editingProprietorIndex, setEditingProprietorIndex] = useState<number | null>(null);
    const [proprietorFormData, setProprietorFormData] = useState({
        name: '',
        designation: '',
        phone: '',
        email: '',
        photo: '',
        photoFile: null as File | null
    });

    // Designation State
    const [designations, setDesignations] = useState<any[]>([]);

    // Category State
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Social Platforms & Designations & Categories
        api.get('/social-platforms').then(res => setSocialPlatforms(res.data));
        api.get('/designations').then(res => setDesignations(res.data));
        api.get('/categories').then(res => setCategories(res.data));
    }, []);

    // Product Handlers
    const handleOpenProductModal = (product?: any, index?: number) => {
        if (product && index !== undefined) {
            setProductFormData(product);
            setEditingProductIndex(index);
        } else {
            setProductFormData({ name: '', price: '', description: '', link: '', image: '', imageFile: null });
            setEditingProductIndex(null);
        }
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = () => {
        if (!productFormData.name) return alert('Product name is required');

        let newProducts = [...products];
        if (editingProductIndex !== null) {
            newProducts[editingProductIndex] = productFormData;
        } else {
            newProducts.push(productFormData);
        }
        setProducts(newProducts);
        setIsProductModalOpen(false);
    };

    // Proprietor Handlers
    const handleOpenProprietorModal = (proprietor?: any, index?: number) => {
        if (proprietor && index !== undefined) {
            setProprietorFormData(proprietor);
            setEditingProprietorIndex(index);
        } else {
            setProprietorFormData({ name: '', designation: '', phone: '', email: '', photo: '', photoFile: null });
            setEditingProprietorIndex(null);
        }
        setIsProprietorModalOpen(true);
    };

    const handleSaveProprietor = () => {
        if (!proprietorFormData.name) return alert('Proprietor name is required');

        let newProprietors = [...proprietors];
        if (editingProprietorIndex !== null) {
            newProprietors[editingProprietorIndex] = proprietorFormData;
        } else {
            newProprietors.push(proprietorFormData);
        }
        setProprietors(newProprietors);
        setIsProprietorModalOpen(false);
    };

    // Files (Keep separate to handle upload logic)
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData((prev: any) => ({ ...prev, ...initialData }));
            setSocialLinks(initialData.social_links || []);
            setProducts(initialData.products || []);
            setProprietors(initialData.proprietors || []);

            // Sync Dropdowns
            if (initialData.country) {
                const c = Country.getAllCountries().find(c => c.name === initialData.country);
                if (c) {
                    setSelectedCountry(c.isoCode);
                    if (initialData.state) {
                        const s = State.getStatesOfCountry(c.isoCode).find(s => s.name === initialData.state);
                        if (s) setSelectedState(s.isoCode);
                    }
                }
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        // Validation
        if (!formData.business_name) return alert('Business Name is required');
        if (!formData.category) return alert('Category is required');

        setLoading(true);
        try {
            const data = new FormData();

            // Append basic fields
            Object.keys(formData).forEach(key => {
                const value = (formData as any)[key];
                if (key === 'bank_details') {
                    // Flatten logic or send array/json? Backend expects JSON casted array? 
                    // Ideally send keys like bank_details[bank_name] or just simple key iteration if backend can handle it.
                    // Since backend casts to array, let's send it as individual keys if possible or just loop it.
                    // Wait, Laravel casts 'bank_details' => 'array', so if we send bank_details[bank_name], it works.
                    Object.keys(value).forEach(bdKey => {
                        data.append(`bank_details[${bdKey}]`, value[bdKey] || '');
                    });
                } else if (value !== null && value !== undefined && typeof value !== 'object') {
                    data.append(key, value as string);
                }
            });

            // Append Files
            if (profilePhoto) data.append('profile_photo', profilePhoto);
            if (coverPhoto) data.append('cover_photo', coverPhoto);
            if (paymentQrFile) data.append('payment_qr_code', paymentQrFile);

            // Append Arrays (Social Links, Products, Proprietors)
            socialLinks.forEach((link, index) => {
                data.append(`social_links[${index}][platform]`, link.platform);
                data.append(`social_links[${index}][url]`, link.url);
            });

            products.forEach((prod, index) => {
                if (prod.id) data.append(`products[${index}][id]`, prod.id);
                data.append(`products[${index}][name]`, prod.name);
                data.append(`products[${index}][price]`, prod.price || '');
                data.append(`products[${index}][description]`, prod.description || '');
                data.append(`products[${index}][link]`, prod.link || '');
                // Correct file key matching backend: products.{index}.imageFile
                if (prod.imageFile) data.append(`products[${index}][imageFile]`, prod.imageFile);
            });

            proprietors.forEach((prop, index) => {
                if (prop.id) data.append(`proprietors[${index}][id]`, prop.id);
                data.append(`proprietors[${index}][name]`, prop.name);
                data.append(`proprietors[${index}][designation]`, prop.designation || '');
                data.append(`proprietors[${index}][phone]`, prop.phone || '');
                data.append(`proprietors[${index}][email]`, prop.email || '');
                if (prop.photoFile) data.append(`proprietors[${index}][photoFile]`, prop.photoFile);
            });

            // API Call
            let response;
            if (isEditing) {
                data.append('_method', 'PUT'); // Spoof PUT for FormData
                response = await api.post(`/cards/${initialData.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/cards', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            alert('Card saved successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Failed to save card.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // Helper to add social link
    const addSocialLink = () => {
        if (!selectedPlatform || !socialUsername) return;
        const platform = socialPlatforms.find(p => p.name === selectedPlatform);
        if (platform) {
            const url = `${platform.base_url}${socialUsername}`;
            setSocialLinks([...socialLinks, { platform: platform.name, url }]);
            setSelectedPlatform('');
            setSocialUsername('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 mb-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between -mx-4 px-4 md:-mx-0 md:px-0">
                <Button variant="ghost" onClick={() => router.back()} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                    {isEditing ? 'Edit Card' : 'Create New Card'}
                </h1>
                <Button onClick={handleSave} isLoading={loading} className="shadow-lg shadow-blue-500/20">
                    <Save className="w-4 h-4 mr-2" /> Save
                </Button>
            </div>

            {/* Business Details */}
            <Section title="Business Details" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <ImageUpload
                        label="Profile Photo"
                        onChange={setProfilePhoto}
                        preview={formData.profile_photo}
                    />
                    <ImageUpload
                        label="Cover Image"
                        onChange={setCoverPhoto}
                        preview={formData.cover_photo}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Business Name" name="business_name" value={formData.business_name} onChange={handleChange} />
                    <Input label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
                    <Input label="Sub Heading" name="sub_header" value={formData.sub_header} onChange={handleChange} />
                    <Input label="Founded In" type="date" name="founded_at" value={formData.founded_at} onChange={handleChange} />
                    {/* Category Dropdowns */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                        <select
                            name="category"
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value, sub_category: '' })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sub Category</label>
                        <select
                            name="sub_category"
                            value={formData.sub_category || ''}
                            onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                            disabled={!formData.category}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        >
                            <option value="">Select Sub Category</option>
                            {formData.category && categories.find((c: any) => c.name === formData.category)?.sub_categories.map((sub: any) => (
                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                            value={formData.description || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </Section>

            {/* Bank Details */}
            <Section title="Bank Details">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Bank Name"
                            value={formData.bank_details?.bank_name || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                bank_details: { ...formData.bank_details, bank_name: e.target.value }
                            })}
                        />
                        <Input
                            label="Account Holder Name"
                            value={formData.bank_details?.account_holder_name || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                bank_details: { ...formData.bank_details, account_holder_name: e.target.value }
                            })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Account Number"
                            value={formData.bank_details?.account_number || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                bank_details: { ...formData.bank_details, account_number: e.target.value }
                            })}
                        />
                        <Input
                            label="IFSC Code"
                            value={formData.bank_details?.ifsc_code || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                bank_details: { ...formData.bank_details, ifsc_code: e.target.value }
                            })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bank / UPI QR Code</label>
                        <ImageUpload
                            label=""
                            onChange={(file) => {
                                setPaymentQrFile(file);
                                setFormData({
                                    ...formData,
                                    payment_qr_code: file ? URL.createObjectURL(file) : formData.payment_qr_code
                                });
                            }}
                            preview={formData.payment_qr_code}
                            className="w-full"
                        />
                        <p className="text-xs text-slate-500 mt-1">Max 2MB. JPG, PNG</p>
                    </div>
                </div>
            </Section>

            {/* Address */}
            <Section title="Address">
                <div className="space-y-4">
                    <Input
                        label="Address Line"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="01, Vishwakarma mandir ki gali..."
                    />

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                            <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                            Location Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Country */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Country</label>
                                <select
                                    name="country"
                                    value={selectedCountry}
                                    onChange={(e) => {
                                        const iso = e.target.value;
                                        const country = Country.getCountryByCode(iso);
                                        setSelectedCountry(iso);
                                        setFormData({ ...formData, country: country?.name || '', state: '', city: '' });
                                        setSelectedState('');
                                    }}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="">Select Country</option>
                                    {Country.getAllCountries().map((c) => (
                                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">State</label>
                                <select
                                    name="state"
                                    value={selectedState}
                                    onChange={(e) => {
                                        const iso = e.target.value;
                                        const state = State.getStateByCodeAndCountry(iso, selectedCountry);
                                        setSelectedState(iso);
                                        setFormData({ ...formData, state: state?.name || '', city: '' });
                                    }}
                                    disabled={!selectedCountry}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:opacity-50 disabled:bg-slate-50"
                                >
                                    <option value="">Select State</option>
                                    {selectedCountry && State.getStatesOfCountry(selectedCountry).map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">City</label>
                                <select
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={(e) => {
                                        setFormData({ ...formData, city: e.target.value });
                                    }}
                                    disabled={!selectedState}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:opacity-50 disabled:bg-slate-50"
                                >
                                    <option value="">Select City</option>
                                    {selectedState && City.getCitiesOfState(selectedCountry, selectedState).map((c) => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                            <span className="w-1 h-4 bg-purple-500 rounded-full mr-2"></span>
                            Map & Coordinates
                        </h4>
                        <div className="space-y-4">
                            <Input
                                label="Map URL"
                                name="map_url"
                                value={formData.map_url}
                                onChange={handleChange}
                                placeholder="https://maps.google.com/..."
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g. 23.0225" />
                                <Input label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g. 72.5714" />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Contact & Social */}
            <Section title="Contact & Social">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
                    <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Social Media Links</h3>

                    {/* Add New Link UI */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Platform</label>
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Platform</option>
                                    {socialPlatforms.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Username / ID</label>
                                <input
                                    type="text"
                                    value={socialUsername}
                                    onChange={(e) => setSocialUsername(e.target.value)}
                                    placeholder="e.g. johndoe"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <Button size="sm" onClick={addSocialLink} className="w-full" disabled={!selectedPlatform || !socialUsername}>
                                    + Add Link
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {socialLinks.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No social links added.</p>}
                        {socialLinks.map((link, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 text-xs font-bold">
                                        {link.platform[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{link.platform}</p>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">
                                            {link.url}
                                        </a>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== idx))}
                                    className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Products */}
            <Section title="Products">
                <DynamicList
                    title="Products"
                    items={products}
                    renderItem={(prod) => (
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: prod.image ? `url(${prod.image})` : undefined }}></div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{prod.name}</div>
                                <div className="text-xs text-slate-500">{prod.price ? `$${prod.price}` : 'Free'}</div>
                            </div>
                        </div>
                    )}
                    onAdd={() => handleOpenProductModal()}
                    onEdit={(item, idx) => handleOpenProductModal(item, idx)}
                    onDelete={(item, idx) => setProducts(products.filter((_, i) => i !== idx))}
                    addButtonLabel="Add Product"
                />

                <Modal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    title={editingProductIndex !== null ? 'Edit Product' : 'Add New Product'}
                >
                    <div className="space-y-4">
                        <ImageUpload
                            label="Product Image"
                            onChange={(file) => {
                                setProductFormData({
                                    ...productFormData,
                                    imageFile: file,
                                    image: file ? URL.createObjectURL(file) : productFormData.image
                                });
                            }}
                            preview={productFormData.image}
                        />

                        <Input
                            label="Product Name"
                            name="name"
                            value={productFormData.name}
                            onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Price"
                                name="price"
                                type="number"
                                value={productFormData.price}
                                onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                            />
                            <Input
                                label="Link (Buy URL)"
                                name="link"
                                value={productFormData.link}
                                onChange={(e) => setProductFormData({ ...productFormData, link: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                value={productFormData.description}
                                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSaveProduct}>
                                {editingProductIndex !== null ? 'Update Product' : 'Add Product'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </Section>

            {/* Proprietors */}
            <Section title="Proprietors (Owners)">
                <DynamicList
                    title="Proprietors"
                    items={proprietors}
                    renderItem={(owner) => (
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: owner.photo ? `url(${owner.photo})` : undefined }}></div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{owner.name}</div>
                                <div className="text-xs text-slate-500">{owner.designation}</div>
                            </div>
                        </div>
                    )}
                    onAdd={() => handleOpenProprietorModal()}
                    onEdit={(item, idx) => handleOpenProprietorModal(item, idx)}
                    onDelete={(item, idx) => setProprietors(proprietors.filter((_, i) => i !== idx))}
                    addButtonLabel="Add Proprietor"
                />

                <Modal
                    isOpen={isProprietorModalOpen}
                    onClose={() => setIsProprietorModalOpen(false)}
                    title={editingProprietorIndex !== null ? 'Edit Proprietor' : 'Add New Proprietor'}
                >
                    <div className="space-y-4">
                        <ImageUpload
                            label="Profile Photo"
                            onChange={(file) => {
                                setProprietorFormData({
                                    ...proprietorFormData,
                                    photoFile: file,
                                    photo: file ? URL.createObjectURL(file) : proprietorFormData.photo
                                });
                            }}
                            preview={proprietorFormData.photo}
                        />

                        <Input
                            label="Name"
                            name="name"
                            value={proprietorFormData.name}
                            onChange={(e) => setProprietorFormData({ ...proprietorFormData, name: e.target.value })}
                        />


                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Designation</label>
                            <select
                                value={proprietorFormData.designation}
                                onChange={(e) => setProprietorFormData({ ...proprietorFormData, designation: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select Designation</option>
                                {designations.map((d: any) => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Phone"
                                name="phone"
                                value={proprietorFormData.phone}
                                onChange={(e) => setProprietorFormData({ ...proprietorFormData, phone: e.target.value })}
                            />
                            <Input
                                label="Email"
                                name="email"
                                value={proprietorFormData.email}
                                onChange={(e) => setProprietorFormData({ ...proprietorFormData, email: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSaveProprietor}>
                                {editingProprietorIndex !== null ? 'Update Proprietor' : 'Add Proprietor'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </Section>
        </div>
    );
}
