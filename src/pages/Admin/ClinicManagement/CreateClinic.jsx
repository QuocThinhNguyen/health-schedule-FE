import CustomTinyMCE from '~/components/CustomTinyMCE';
import Input from '~/components/Input/input';

function CreateClinic() {
    return (
        <>
            <div className="px-3 mb-6">
                <h1 className="text-xl font-medium my-6 text-[var(--text-secondary)]">
                    Thêm bệnh viện
                </h1>
                <div className='px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]'>
                    <Input
                        label="Tên bệnh viện"
                        type="text"
                        placeholder="Nhập tên bệnh viện"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        // error={emailError}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Nhập email bệnh viện"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        // error={emailError}
                    />
                    <Input
                        label="Địa chỉ"
                        type="text"
                        placeholder="Nhập địa chỉ bệnh viện"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        // error={emailError}
                    />
                    <Input
                        label="Số điện thoại"
                        type="text"
                        placeholder="Nhập số điện thoại bệnh viện"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        // error={emailError}
                    />
                    <div className="col-span-2">
                        <label className='block text-sm font-medium mb-1 text-[var(--text-secondary)]'>
                            Mô tả
                        </label>
                        <CustomTinyMCE
                            name="description"
                            // value={clinic.description}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                        />
                        {/* {validationErrors.description && (
                            <p className="text-red-500 text-sm">{validationErrors.description}</p>
                        )} */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateClinic;
